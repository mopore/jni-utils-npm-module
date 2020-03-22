import { AssertionError } from "assert";

const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;
const MONDAY_INDEX = 1;
const DAYS_UNTIL_LAST_MONDAY = 6;
const FOR_US_CORRECTION = 1;

export class DateUtils {
    static toIsoWithMinutes( sourceDate: Date ): string{
        const result: string = sourceDate.toISOString(). // would result in: '2012-11-04T14:51:06.157Z'
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '').     // delete the dot and everything after
        replace(':', 'h').       // 2012-11-04 14h55:45
        replace(' ', '_').       // 2012-11-04_14h55:45
        // eslint-disable-next-line no-useless-escape
        replace(/\:.+/, '').     // remove everything afer the last colon(:)
        concat('min');           // 2012-11-04_14h55min
        return result;
    }

    static toIsoDay( sourceDate: Date ): string{
        const result: string = sourceDate.toISOString(). // would result in: '2012-11-04T14:51:06.157Z'
        replace(/T.+/, '');     // delete the T and everything after -> 2012-11-04
        return result;
    }

    static readonly weekdayNames = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    static toWeekdayName( sourceDate: Date ): string{
        const result: string = DateUtils.weekdayNames[ sourceDate.getDay() ];
        return result;
    }

    static sortOldestFirst( dayDates: Date[] ): Date[] {
        const sortedDates = dayDates.sort( (leftDate, rightDate) => {
            let result = 0;
            if (leftDate < rightDate){
                result = -1;
            }
            else if (leftDate > rightDate) {
                result = 1;
            }
            return result;
        });
        return sortedDates;
    }

    static sortYoungestFirst( dayDates: Date[] ): Date[] {
        const sortedDates = dayDates.sort( (leftDate, rightDate) => {
            let result = 0;
            if (leftDate < rightDate){
                result = 1;
            }
            else if (leftDate > rightDate) {
                result = -1;
            }
            return result;
        });
        return sortedDates;
    }
    
    static getSundayOfPenultimateWeek( day: Date ): Date {
        const FRIDAY_INDEX = 5;
        const ONE_DAY = 1;
        const TWO_WEEKS = 14;
        const WEEKEND = 2;

        const subject = day;
        while ( subject.getDay() !== FRIDAY_INDEX ) {
            subject.setDate( subject.getDate() - ONE_DAY );
        }

        subject.setDate( subject.getDate() - TWO_WEEKS + WEEKEND );
        return subject;
    }

    static getLatestSunday( day: Date ): Date {

        if ( day.getDay() === SUNDAY_INDEX )
            return day;

        const FRIDAY_INDEX = 5;
        const ONE_DAY = 1;
        const ONE_WEEK = 7;
        const WEEKEND = 2;

        const subject = day;
        while ( subject.getDay() !== FRIDAY_INDEX ) {
            subject.setDate( subject.getDate() - ONE_DAY );
        }

        subject.setDate( subject.getDate() - ONE_WEEK + WEEKEND );
        return subject;
    }

    static intersectDates( sourceDays: Date[], notOlder: Date, notYounger: Date ): Date[] {
        const sortedDays = DateUtils.sortOldestFirst( sourceDays );
        let results: Date[] = [];
        const FIRST = 0;
        let index  = FIRST;
        let day = sortedDays[FIRST];

        // condition 1: Dates are not older than 'notOlder'
        // condition 2: Dates are not younger than 'notYounger'
        let condition1 = day >= notOlder;
        let condition2 = day < notYounger;

        while( condition2 ){
            if (condition1 && condition2 ) {
                results = [...results, day];
            }

            index++;
            day = sortedDays[index];
            condition1 = day >= notOlder;
            condition2 = day < notYounger;          
        }

        return results;
    }

    static createAllWeekDaysFromEntry(entry: Date): Date[] {

        // Make a copy
        const testDate = new Date( DateUtils.toIsoDay(entry) );
        const dayOfWeek = entry.getDay();
        // change date to Monday
        if (dayOfWeek === SUNDAY_INDEX) {
            testDate.setDate( testDate.getDate() - DAYS_UNTIL_LAST_MONDAY );       
        }
        else {
            const daysToSubstract = dayOfWeek - FOR_US_CORRECTION;
            testDate.setDate( testDate.getDate() - daysToSubstract );
        }
        const mondayIsoDate = DateUtils.toIsoDay( testDate );

        let weekEntries: Date[] = [];
        for ( let i = 0; i<7; i++ ){
            const day = new Date( mondayIsoDate );
            day.setDate( day.getDate() + i );
            weekEntries = [ ...weekEntries, day ];
        }
        return weekEntries;
    }

    static createDaysPerWeek( start: Date, end: Date ): Date[][] {
        const nextDayInCurrentWeek = (input: Date ): (Date | undefined) => {
            const newDate = new Date( DateUtils.toIsoDay( input ) );
            newDate.setDate( newDate.getDate() +1 );
            const dayOfWeek = newDate.getDay();
            if ( dayOfWeek !== MONDAY_INDEX ){
                return newDate;
            }
            return undefined;
        };
        const dayPlusOne = (input: Date): Date => {
            const newDate = new Date( DateUtils.toIsoDay( input ) );
            newDate.setDate( newDate.getDate() +1 );
            return newDate;
        }
        
        let weeks: Date[][] = [];
        let currentDay = start;
        let currentWeek: Date[] = [currentDay];

        while (currentDay <= end ){
            let nextDay = nextDayInCurrentWeek( currentDay );
            if ( nextDay ){
                currentWeek = [...currentWeek, nextDay ];
            }
            else { // Need to switch week
                weeks = [...weeks, currentWeek];
                currentWeek = [];
                nextDay = dayPlusOne( currentDay );
                currentWeek = [...currentWeek, nextDay ];
            }
            currentDay = nextDay;
            if ( currentDay === end ){
                weeks = [...weeks, currentWeek]
            }
        }

        return weeks;
    }

    static daysBetweenDates( firstDate: Date, secondDate: Date ): number {
        const diffTime = Math.abs( secondDate.getTime() - firstDate.getTime() );
        const diffDays = Math.ceil( diffTime / (1000 * 60 * 60 * 24) ); 
        return diffDays;
    }

    static dateIsOnWeekend( testDate: Date ): boolean {
        const dayInWeek = testDate.getDay();
        const onWeekEnd = dayInWeek === SUNDAY_INDEX || dayInWeek == SATURDAY_INDEX; 
        return onWeekEnd;
    }
}

export class Assert {

    static isDefined<T>(val: T): asserts val is NonNullable<T> {
        if (val === undefined || val === null) {
            throw new AssertionError(
                {
                    message: `Expected 'val' to be defined, but received ${val}`,
                    expected: 'A value which is not "null", "undefined" nor "never"'
                }
            );
        }
    }

    static isFilledArray<T>(val: T[]): T[] {
        if ( val.length < 1 ) {
            throw new AssertionError(
                {
                    message: `Expected array not to be empty, but "length < 0"`,
                    expected: 'An array with at least one entry.'
                }
            );
        }
        return val;
    }
}

export class Sleep{
    static delayProcessing(seconds: number): Promise<void>{
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, seconds * 1000);
        });
    }
}