import { DateUtils } from "./JniCommon";

const daysByWeeks: Date[][] = DateUtils.createDaysPerWeek( 
    new Date('2017-07-01'), 
    new Date('2020-09-27')
);

console.log(daysByWeeks.length);
