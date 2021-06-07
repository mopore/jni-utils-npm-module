import { JniCommon } from "..";
import { DateUtils } from "../jni/utils/common/JniCommon";

describe("DateUtils", () => {
    describe("isSameDay", () => {
        const date1 = new Date();
        const date2 = new Date();
        it("two dates created on the same day at different time or not equal", () => {
            expect(date1).not.toBe(date2);
        });
        it("two dates created on the same day should be on the same day", () => {
            expect(JniCommon.DateUtils.isSameDay(date1,date2)).toBeTruthy();
        });
        const date3 = new Date("2021-01-31");
        const date4 = new Date(2021,0,31);
        it("two manually dates created dates for 2021-01-31 are the same day", () => {
            expect(JniCommon.DateUtils.isSameDay(date3, date4)).toBeTruthy();
        });
    });
    describe("createDateArray", () => {
        const firstDay = new Date("2021-01-01");
        const lastDay = new Date("2021-01-10");
        const dateArray = DateUtils.createDateArray(firstDay, lastDay);
        it("should produce an array with 10 dates beginning from Jan 1 and ending on Jan 10", () => {
            // const dateArray = DateUtils.createDateArray(firstDay, lastDay);
            expect(dateArray.length).toEqual(10);
            expect(dateArray[0]).toEqual(new Date("2021-01-01"));
            expect(dateArray[9]).toEqual(new Date("2021-01-10"));
        });
    });
    describe("intersectDates", () => {
        const firstDay = new Date("2021-01-02");
        const lastDay = new Date("2021-01-04");
        const sourceDays = [
            new Date("2021-01-01"),
            new Date("2021-01-02"),
            new Date("2021-01-03"),
            new Date("2021-01-04"),
            new Date("2021-01-05"),
        ];
        const dateArray = DateUtils.intersectDates(sourceDays, firstDay, lastDay);
        it("should produce an intersected array with 3 dates beginning from Jan 2 and ending on Jan 4", () => {
            expect(dateArray.length).toEqual(3);
            expect(dateArray[0]).toEqual(new Date("2021-01-02"));
            expect(dateArray[2]).toEqual(new Date("2021-01-04"));
        });
    });
    describe("createDaysForMonthString", () => {
        it("should return an array of 31 days", () => {
            const inputIsoString = "2021-01-31";
            const result = DateUtils.createDaysForMonthString(inputIsoString);
            expect(result.length).toEqual(31);
        });
        it("should return an array of 30 days", () => {
            const inputIsoString = "2021-04";
            const result = DateUtils.createDaysForMonthString(inputIsoString);
            expect(result.length).toEqual(30);
        });
    });
});