import scheduleParser from './scheduleParser.mjs';

(async () => {
  const s = await scheduleParser("aiusufov", "");
  console.log(s);
})();
