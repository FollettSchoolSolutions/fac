/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    describe('DateTimeServiceSpec', function () {
        var testData = {dates: {}}, dts = null;

        beforeEach(function () {
            module('fss.services.datetime');

            inject(function (DateTimeService) {
                dts = DateTimeService;
            });
            testData = {dates: {}};
            testData.dates.Jan_1_2000 = new Date(2000, 0, 1);
            testData.dates.Jan_1_2000_funky = new Date(1999, 11, 32);
            testData.dates.Jan_2_2000 = new Date(2000, 0, 2);
            testData.dates.Jan_3_2000 = new Date(2000, 0, 3);
            testData.dates.Feb_1_2000 = new Date(2000, 1, 1);
            testData.dates.Jan_1_2001 = new Date(2001, 0, 1);
            testData.dates.May_6_2012 = new Date(2012, 4, 6);
            testData.dates.Feb_6_2013 = new Date(2013, 1, 6);
            testData.dates.Jul_15_2012 = new Date(2012, 6, 15);
            testData.dates.Sep_9_2018 = new Date(2018, 8, 9);
            testData.dates.Oct_31_2012 = new Date(2012, 9, 31);
        });

        it("isValidDate verifies correct format of date", function () {
            var invalidDates = [null, "", "a", "a/b/c", "aa/bb/cccs", "3", "35", "4/2035", "4/2034/33",
                                "06/15/13", "06//2005", "a/4/2010", "3/40/2008", "13/31/2013", "text 04/30/2008",
                                "04/30/2008 hey there", "04/30/2008 a", "04/30/2008/1", "04/30/2008 ", "04/30/12345"],
                validDates = ["3/3/2003", "03/3/2003", "5/06/2006", "06/13/2007", "2/31/2013"],
                i;
            //yes, it will allow 2/31/xxxx ...I'm considering this good enough though and server side should also validate
            for (i = 0; i < invalidDates.length; i++) {
                expect(dts.isValidDate(invalidDates[i])).toBe(false, "[" + invalidDates[i] + "]" + " should be an invalid date");
            }
            for (i = 0; i < validDates.length; i++) {
                expect(dts.isValidDate(validDates[i])).toBe(true, "[" + validDates[i] + "]" + " should be a valid date");
            }

        });

        it("compareDates", function () {
            expect(dts.compareDates(testData.dates.Jan_1_2000, testData.dates.Jan_1_2000)).toBe(0);
            expect(dts.compareDates(testData.dates.Jan_1_2000, testData.dates.Jan_1_2000_funky)).toBe(0);
            expect(dts.compareDates(testData.dates.Jan_1_2000, testData.dates.Jan_2_2000)).toBe(-1);
            expect(dts.compareDates(testData.dates.Jan_1_2000, testData.dates.Jan_1_2001)).toBe(-1);
            expect(dts.compareDates(testData.dates.Jan_1_2000, testData.dates.Feb_1_2000)).toBe(-1);
            expect(dts.compareDates(testData.dates.Jan_2_2000, testData.dates.Jan_1_2000)).toBe(1);
            expect(dts.compareDates(testData.dates.Jan_1_2001, testData.dates.Jan_1_2000)).toBe(1);
            expect(dts.compareDates(testData.dates.Feb_1_2000, testData.dates.Jan_1_2000)).toBe(1);
        });

        it("parseDateISO8601", function () {
            expect(dts.parseDateISO8601("2000-1-3")).toEqual(testData.dates.Jan_3_2000);
            expect(dts.parseDateISO8601("2012-05-06")).toEqual(testData.dates.May_6_2012);
            expect(dts.parseDateISO8601("2012-14-06")).toEqual(testData.dates.Feb_6_2013);
            expect(dts.parseDateISO8601("2012-06-45")).toEqual(testData.dates.Jul_15_2012);

            expect(function () {
                dts.parseDateISO8601("not a date");
            }).toThrow();

            expect(function () {
                dts.parseDateISO8601();
            }).toThrow();

            expect(function () {
                dts.parseDateISO8601("2000-01");
            }).toThrow();
            expect(function () {
                dts.parseDateISO8601(1);
            }).toThrow();
            expect(function () {
                dts.parseDateISO8601("06-28-2005");
            }).toThrow();

        });

        it("format date formats data correctly and pads with 0's", function () {
            expect(dts.formatDate(testData.dates.Jan_1_2000)).toBe("01/01/2000");
            expect(dts.formatDate(testData.dates.Jul_15_2012)).toBe("07/15/2012");
            expect(dts.formatDate(testData.dates.Oct_31_2012)).toBe("10/31/2012");
            expect(dts.formatDate(testData.dates.Sep_9_2018)).toBe("09/09/2018");
            expect(dts.formatDate("")).toBe("");
            expect(dts.formatDate(null)).toBe("");
            expect(dts.formatDate(undefined)).toBe("");
            expect(dts.formatDate()).toBe("");

        });
        it("format date ISO8601 formats data correctly and pads with 0's", function () {
            expect(dts.formatDateISO8601(testData.dates.Jan_1_2000)).toBe("2000-01-01");
            expect(dts.formatDateISO8601(testData.dates.Jul_15_2012)).toBe("2012-07-15");
            expect(dts.formatDateISO8601(testData.dates.Oct_31_2012)).toBe("2012-10-31");
            expect(dts.formatDateISO8601(testData.dates.Sep_9_2018)).toBe("2018-09-09");
            expect(dts.formatDateISO8601("")).toBe("");
            expect(dts.formatDateISO8601(null)).toBe("");
            expect(dts.formatDateISO8601(undefined)).toBe("");
            expect(dts.formatDateISO8601()).toBe("");

        });
    });

}());
