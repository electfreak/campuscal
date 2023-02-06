import puppeteer from 'puppeteer';

let weekDaysToInt = new Map(
  [
    ['Monday', 0],
    ['Tuesday', 1],
    ['Wednesday', 2],
    ['Thursday', 3],
    ['Friday', 4],
    ['Saturday', 5],
    ['Sunday', 6]
  ]
);

export default async (login, passwd) => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  await page.goto('https://campusnet.jacobs-university.de/');

  // Set screen size
  // await page.setViewport({
  //   width: 100,
  //   height: 1024
  // });

  await page.waitForSelector("#logIn_btn");
  await page.click("#logIn_btn");

  // Login page
  await page.waitForSelector('#Username');
  await page.type("#Username", login);

  await page.waitForSelector('#Password');
  await page.type("#Password", passwd);

  await page.waitForSelector('button[value=login]');
  await page.click('button[value=login]');

  // Back to campusnet
  const scheduleBtn = await page.waitForSelector('text/My Course Schedule');
  await scheduleBtn.click();

  const ww = await page.waitForSelector("a.img.workdays-week");
  await ww.click();

  await page.waitForSelector(".appointment");
  const schedule = await page.evaluate(() => {
    const startDate = document.querySelector("option[selected]")
      .textContent
      .trim()
      .match(/\d{2}\.\d{2}.\d{4}/)
      .toString()
      .split('.')
      .map(Number)
      .reverse()
    ;

    return {
      startDate,
      events: [...document.querySelectorAll(".appointment")].map(i => ({
        
        title: i.querySelector('.link').getAttribute("title"),
        time: i.querySelector('.timePeriod').childNodes[0].textContent.trim().split(' - '),
        weeekDay: i.getAttribute("abbr").split(" ")[0],
        
      }))
    };

  });

  await page.waitForNetworkIdle();

  await page.screenshot({
    path: "./img.png"
  });

  await browser.close();

  return schedule;
};
