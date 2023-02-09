import * as ics from "ics";
import { writeFileSync } from "fs";
import { createHash } from "crypto";

let weekDaysToInt = new Map([
  ["Monday", 0],
  ["Tuesday", 1],
  ["Wednesday", 2],
  ["Thursday", 3],
  ["Friday", 4],
  ["Saturday", 5],
  ["Sunday", 6],
]);

const makeEvent = (event, startDate) => {
  const { title, location, duration } = event;
  const start = new Date(startDate);
  start.setHours(event.startTime[0]);
  start.setMinutes(event.startTime[1]);
  start.setDate(start.getDate() + weekDaysToInt.get(event.weekDay));
  
  return {
    title,
    location,
    start,
    busyStatus: "BUSY",
    duration,
    uid: createHash("md5")
      .update(
        start.toISOString() +
          duration.hours +
          ":" +
          duration.minutes +
          title +
          location
      )
      .digest("hex"),
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
    ],
  };
};

export default (weeks) => {
  const { error, value } = ics.createEvents(
    weeks
      .map((week) =>
        week.events.map((event) => makeEvent(event, week.startDate))
      )
      .flat()
  );

  return value;
};
