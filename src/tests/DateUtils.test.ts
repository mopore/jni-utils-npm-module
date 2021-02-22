import { JniCommon } from "..";

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
        it ("two manually dates created dates for 2021-01-31 are the same day", () => {
            expect(JniCommon.DateUtils.isSameDay(date3, date3)).toBeTruthy();
        });
    });
});