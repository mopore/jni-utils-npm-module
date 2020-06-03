import { JniCommon } from ".";

console.log('Hello');

const latestSunday = JniCommon.DateUtils.getLatestSunday(new Date());
console.log('Latest Sunday is: ' + latestSunday);
