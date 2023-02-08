import * as ics from 'ics';
import { writeFileSync } from 'fs';

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
    busyStatus: 'BUSY',
    duration,
    start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
  };

};

export default schedule => {
  console.log(schedule.events.map(i => makeEvent(i, schedule.startDate)));
  const { error, value } = ics.createEvents(
    schedule.events.map(i => makeEvent(i, schedule.startDate))
  );

  console.log("succ");

  writeFileSync(`../cal.ics`, value)
};
