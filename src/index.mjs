import scheduleParser from "./scheduleParser.mjs";
import icsMaker from "./icsMaker.mjs";
import { writeFileSync } from "fs";
import open from "open";

(async () => {
  const { argv } = process;

  const weeks = await scheduleParser(argv[2], argv[3], argv[4] ?? 0);
  const ics = icsMaker(weeks);
  writeFileSync(`cal.ics`, ics);
  open("cal.ics");
})();
