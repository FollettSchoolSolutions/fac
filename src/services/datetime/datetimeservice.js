/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    /**
     * DateTimeService helps with some of the date manipulation needed by the library.  
     * Note: it is deficient at the time of writing.  It does not respect locale.  It assumes that a formatted date will be of form
     * mm/dd/yyyy and that a valid date will be in that format as well.
     * The other methods related to iso8601 perform as expected.
     * @module services.datetime
     */
    angular.module('fss.services.datetime', [])

        .factory('DateTimeService', [function () {
            var spec = {}, service = {},
                DATE_SEPARATOR = "/";

            /**
             * Tests whether date conforms to mm/dd/yyyy format.  
             * @param dateStr a date string to validate
             * @returns {Boolean} for whether the passed string is a valid, parsable date.
             */
            service.isValidDate = function (dateStr) {
                var valid = false,
                    pattern = new RegExp("^\\d{1,2}/\\d{1,2}/\\d{4}$"),
                    patternResult = false,
                    result = null;
                if (dateStr) {
                    result = spec.parseDate(dateStr);
                    if (dateStr && dateStr.match(pattern)) {
                        patternResult = true;
                    }
                    if (result !== null && result.length === 3 && patternResult) {
                        valid = true;
                    }
                }
                return valid;
            };
            /*
             * Parses out the date string passed in.
             * If invalid, null is returned
             * If valid, an array of [year, month, day] is returned
             */
            spec.parseDate = function (dateStr) {
                var rawValue = dateStr.trim(),
                    cleanDate,
                    parsedDateMillis,
                    parsedDate,
                    retVal = null;
                //Only check the date if it is not an empty string
                if (rawValue !== '' && rawValue !== null) {
                    cleanDate = rawValue;

                    parsedDateMillis = Date.parse(cleanDate);

                    if (parsedDateMillis !== null && !isNaN(parsedDateMillis)) {
                        parsedDate = new Date(parsedDateMillis);
                        retVal = [parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate()];
                    }
                }
                return retVal;
            };

            /**
             * Helper to left pad numbers < 10 with '0'
             */
            function pad(num) {
                var padded = "";
                padded = num.toString();
                if (num < 10) {
                    padded = "0" + num.toString();
                }
                return padded;
            }
            /**
             *
             * @param date A javascript Date object
             * @returns {String} the date in a string format (MM/DD/YYYY)
             */
            service.formatDate = function (date) {
                if (!date) {
                    return "";
                } else {
                    return (pad(date.getMonth() + 1)) + DATE_SEPARATOR + pad(date.getDate()) + DATE_SEPARATOR + date.getFullYear();
                }
            };
            /**
             *
             * @param date A javascript Date object
             * @returns {String} the date in a string format according to the iso8601 spec (YYYY-MM-DD)
             */
            service.formatDateISO8601 = function (date) {
                if (!date) {
                    return "";
                } else {
                    return date.getFullYear() + "-" + pad((date.getMonth() + 1)) + "-" + pad(date.getDate());
                }
            };

            /**
             * Parses the date from ISO8601 form (2000-1-01) to a Date.
             *
             * @method parseDateISO8601
             * @param dateStr
             * @returns {Date}
             */
            service.parseDateISO8601 = function parseDateISO8601(dateStr) {
                var parsedDateStr = dateStr.split("-"), year, month, date;
                if (!parsedDateStr || parsedDateStr.length !== 3 || parsedDateStr[0].length < 4) {
                    throw new Error("Invalid date format.");
                } else {
                    year = parseInt(parsedDateStr[0], 10);
                    month = parseInt(parsedDateStr[1] - 1, 10);
                    date = parseInt(parsedDateStr[2], 10);
                    return new Date(year, month, date);
                }
            };

            /**
             * Returns -1 if the first date is before the second, 0 if equal
             * and 1 if after. This method only compares the date portion of
             * JavaScript Date objects. It does not consider their time.
             *
             * @method compareDates
             * @param {Date} date1
             * @param {Date} date2
             * @returns {Number}
             */
            service.compareDates = function compareDates(date1, date2) {
                if (date1.getFullYear() > date2.getFullYear()) {
                    return 1;
                } else if (date1.getFullYear() < date2.getFullYear()) {
                    return -1;
                } else if (date1.getMonth() > date2.getMonth()) {
                    return 1;
                } else if (date1.getMonth() < date2.getMonth()) {
                    return -1;
                } else if (date1.getDate() > date2.getDate()) {
                    return 1;
                } else if (date1.getDate() < date2.getDate()) {
                    return -1;
                }

                return 0;
            };
            return service;
        }]);
}());
