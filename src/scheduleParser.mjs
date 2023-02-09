import puppeteer from "puppeteer";

const getEventsFromSelectedWeek = async (page) => {
  const schedule = await page.evaluate(() => {
    // debugger;
    const startDate = document
      .querySelector("option[selected]")
      .textContent.trim()
      .match(/\d{2}\.\d{2}.\d{4}/)
      .toString()
      .split(".")
      .map(Number)
      .reverse();

    const calcDuration = (time) => {
      // debugger;
      const [start, end] = time.split(" - ").map((i) => i.match(/\d\d/g));
      const startMins = Number(start[0]) * 60 + Number(start[1]);
      const endMins = Number(end[0]) * 60 + Number(end[1]);
      return {
        hours: Math.floor((endMins - startMins) / 60),
        minutes: (endMins - startMins) % 60,
      };
    };

    return {
      startDate,
      events: [...document.querySelectorAll(".appointment")].map((i) => {
        const timePeriod = i.querySelector(".timePeriod").textContent.trim();

        return {
          title: i.querySelector(".link").getAttribute("title"),
          weekDay: i.getAttribute("abbr").split(" ")[0],
          duration: calcDuration(
            timePeriod.match(/\d\d:\d\d - \d\d:\d\d/).toString()
          ),
          startTime: timePeriod
            .match(/\d\d:\d\d/)
            .toString()
            .split(":")
            .map(Number),
          location: i.querySelector("a.arrow")?.textContent.trim(),
        };
      }),
    };
  });

  return schedule;
};

export default async (login, passwd, numberOfWeeks) => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: true,
    // slowMo: 250
  });
  const page = await browser.newPage();

  await page.goto("https://campusnet.jacobs-university.de/");

  await page.waitForSelector("#logIn_btn");
  await page.click("#logIn_btn");

  // Login page
  await page.waitForSelector("#Username");
  await page.type("#Username", login);

  await page.waitForSelector("#Password");
  await page.type("#Password", passwd);

  await page.waitForSelector("button[value=login]");
  await page.click("button[value=login]");

  // Back to campusnet
  const scheduleBtn = await page.waitForSelector("text/My Course Schedule");
  await scheduleBtn.click();

  const ww = await page.waitForSelector("a.img.workdays-week");
  await ww.click();

  const weeks = [];
  await page.waitForSelector(".appointment");
  weeks.push(await getEventsFromSelectedWeek(page));
  for (let i = 0; i < numberOfWeeks; ++i) {
    await page.click(".img.img_arrowRight.skipRight");
    await page.waitForNetworkIdle();
    await page.waitForSelector(".appointment");

    weeks.push(await getEventsFromSelectedWeek(page));
  }

  await browser.close();

  return weeks;
};
