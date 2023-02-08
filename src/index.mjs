import scheduleParser from './scheduleParser.mjs';
import icsMaker from './icsMaker.mjs';

(async () => {
  const schedule = await scheduleParser("aiusufov", "");
  console.log(JSON.stringify(schedule));
  icsMaker(schedule);
})();
