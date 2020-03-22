import { DateUtils } from "./JniCommon";

const daysByWeeks: Date[][] = DateUtils.createDaysPerWeek( 
    new Date('2017-07-01'), 
    new Date('2020-03-20')
);

console.log(daysByWeeks.length);

