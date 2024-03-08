import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly(
  "Permanently delete Trashcan files after 30-days.",
  { day: 30, hourUTC: 16, minuteUTC: 0 },
  internal.files.deleteAllFiles
);

export default crons;