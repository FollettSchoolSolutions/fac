/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    describe('dateshimspec', function () {
        var compile, rootScope, dts;

        beforeEach(function () {
            angular.module('partials', []);
            module('directives.dateshim');
            inject(function ($compile, $rootScope, $templateCache, DateTimeService, $window) {
                compile = $compile;
                rootScope = $rootScope;
                dts = DateTimeService;
                $templateCache.put('directives/dateshim/dateshim.html', $window.templates.dateshim);
            });
        });
        it("Test that a valid date in the text only field will populate the model with iso8601 date", function () {
            var html, scope = rootScope, input;
            html = angular.element('<form name="myForm"><div data-fss-date-shim name="dateShim" data-ng-model="dueDate" data-iso-date></div></form>');
            scope.dueDate = "";
            compile(html)(scope);
            scope.$digest();
            expect(scope.dueDate).toBe(null);

            input = html.find('input[name="dateShimTextOnly"]');
            input.val("06/20/2020");
            input.trigger('input');
            scope.$digest();
            expect(scope.dueDate).toBe("2020-06-20");

            expect(scope.myForm.$invalid).toBe(false);
            expect(scope.myForm.dateShim.$error).toEqual({validDate: false});

            //give invalid input, verify it is nulled out
            input.val("06/23/2");
            input.trigger('input');
            scope.$digest();
            expect(scope.dueDate).toBe(null);
            expect(scope.myForm.$invalid).toBe(true);
            expect(scope.myForm.dateShim.$error).toEqual({validDate: true});

            //give invalid input, verify it is nulled out
            input.val("06-23-2005");
            input.trigger('input');
            scope.$digest();
            expect(scope.dueDate).toBe(null);
            expect(scope.myForm.$invalid).toBe(true);
            expect(scope.myForm.dateShim.$error).toEqual({validDate: true});
        });

        it("Test that datepicker field will populate the model with iso8601 date", function () {
            var html, scope = rootScope, input, curVal, valid, invalid, i, msg;
            html = angular.element('<div data-fss-date-shim data-ng-model="dueDate" data-iso-date></div>');
            scope.dueDate = "";
            compile(html)(scope);
            scope.$digest();
            expect(scope.dueDate).toBe(null);
            input = html.find('input[name="dateShimNativePicker"]');

            /**
             * Some browsers will prevent an invalid date format from being set in the field
             * This method attempts to set the date in the field and then tries to read that value
             * If the value is empty then the browser prevented it from being set, so we can know
             * that the no valid date should be parsed out
             */
            function setValueInDateField(value) {
                input.val(value);
                return input.val();
            }
            valid = ["2050-6-23", "2050-06-24", "2050-6-25"];
            for (i = 0; i < valid.length; i++) {
                curVal = setValueInDateField(valid[i]);
                input.trigger('input');
                scope.$digest();
                msg = "Valid entry '" + valid[i] + "' ";
                //If the browser didn't accept the input, then the dueDate should not have been set
                if (curVal === '') {
                    msg += " was not accepted by the browser field and so the dueDate should be set to null";
                    expect(scope.dueDate).toBe(null, msg);
                } else {
                    msg += " was accepted by the browser field and so the dueDate should have been set correctly";
                    expect(scope.dueDate).toBe(valid[i], msg);
                }
            }

            invalid = ["2050/6/26", "06/27/2", "06-28-2050"];
            for (i = 0; i < invalid.length; i++) {
                curVal = setValueInDateField(invalid[i]);
                input.trigger('input');
                scope.$digest();
                msg = "Invalid entry '" + invalid[i] + "' should have caused dueDate to be set to null";
                expect(scope.dueDate).toBe(null, msg);
            }
        });

        it("Test that date is set when focus is lost, for iPad date picker support", function () {
            var html, scope = rootScope, input;
            html = angular.element('<form name="myForm"><div data-fss-date-shim data-ng-model="dueDate" data-iso-date></div></form>');
            scope.dueDate = "";
            compile(html)(scope);
            scope.$digest();
            expect(scope.dueDate).toBe(null);
            input = html.find('input[name="dateShimNativePicker"]');

            input.val("2040-07-04");
            input.trigger('blur');
            scope.$digest();
            expect(scope.dueDate).toBe("2040-07-04", "Due date should have been set when losing focus");
            expect(scope.myForm.$valid).toBe(true);

        });
        it("Test that text only picker is shown when picker is not supported", function () {
            var html, scope = rootScope, nativePicker, textPicker;
            html = angular.element('<div data-fss-date-shim data-ng-model="dueDate" data-iso-date data-native-picker="false"></div>');
            scope.dueDate = "";
            compile(html)(scope);
            scope.$digest();
            nativePicker = html.find('input[name="dateShimNativePicker"]');
            textPicker = html.find('input[name="dateShimTextOnly"]');
            expect(nativePicker.parent().hasClass('ng-hide')).toBeTruthy();
            expect(textPicker.parent().hasClass('ng-hide')).toBeFalsy();
        });
        it("Test that date native picker is shown when supported", function () {
            var html, scope = rootScope, nativePicker, textPicker;
            html = angular.element('<div data-fss-date-shim data-ng-model="dueDate" data-iso-date data-native-picker="true"></div>');
            scope.dueDate = "";
            compile(html)(scope);
            scope.$digest();
            nativePicker = html.find('input[name="dateShimNativePicker"]');
            textPicker = html.find('input[name="dateShimTextOnly"]');
            expect(nativePicker.parent().hasClass('ng-hide')).toBeFalsy();
            expect(textPicker.parent().hasClass('ng-hide')).toBeTruthy();
        });
        it("native picker - verify that when the model contains an initial value it is set in the text field", function () {
            var html, scope = rootScope, nativePicker, textPicker;
            scope.dueDate = "2040-08-14";
            html = angular.element('<div data-fss-date-shim data-ng-model="dueDate" data-iso-date></div>');
            compile(html)(scope);
            scope.$digest();
            nativePicker = html.find('input[name="dateShimNativePicker"]');
            textPicker = html.find('input[name="dateShimTextOnly"]');
            expect(textPicker.val()).toBe("08/14/2040");
            expect(nativePicker.val()).toBe("2040-08-14");
            expect(scope.dueDate).toBe("2040-08-14");
        });
        it("text picker - verify that when the model contains an initial value it is set in the text field", function () {
            var html, scope = rootScope, nativePicker, textPicker;
            scope.dueDate = "2040-08-15";
            html = angular.element('<div data-fss-date-shim data-ng-model="dueDate" data-iso-date data-native-picker="false"></div>');
            compile(html)(scope);
            scope.$digest();
            nativePicker = html.find('input[name="dateShimNativePicker"]');
            textPicker = html.find('input[name="dateShimTextOnly"]');
            expect(textPicker.val()).toBe("08/15/2040");
            expect(nativePicker.val()).toBe("2040-08-15");
            expect(scope.dueDate).toBe("2040-08-15");
        });
        it("validator for current date or later", function () {
            var html, scope = rootScope, nativePicker;
            scope.dueDate = "2004-08-14";
            html = angular.element('<form name="myForm"><div data-fss-date-shim name="picker" data-ng-model="dueDate" data-iso-date data-future></div></form>');
            compile(html)(scope);
            scope.$digest();
            nativePicker = html.find('input[name="dateShimNativePicker"]');

            expect(nativePicker.val()).toBe("2004-08-14");
            expect(scope.myForm.$invalid).toBe(true);
            expect(scope.myForm.$valid).toBe(false);
            expect(scope.myForm.picker.$error).toEqual({currentDate: true, validDate: false});

            //set to a future date
            scope.dueDate = "2400-08-14";
            html = angular.element('<form name="myForm"><div data-fss-date-shim name="picker" data-ng-model="dueDate" data-iso-date data-future></div></form>');
            compile(html)(scope);
            scope.$digest();
            nativePicker = html.find('input[name="dateShimNativePicker"]');

            expect(nativePicker.val()).toBe("2400-08-14");
            expect(scope.myForm.$valid).toBe(true);
            expect(scope.myForm.picker.$error).toEqual({currentDate: false, validDate: false});

            //set to today's date
            scope.dueDate =  dts.formatDateISO8601(new Date());
            html = angular.element('<form name="myForm"><div data-fss-date-shim data-ng-model="dueDate" data-iso-date data-name="dueDate" data-future></div></form>');
            compile(html)(scope);
            scope.$digest();
            nativePicker = html.find('input[name="dateShimNativePicker"]');

            expect(scope.myForm.$valid).toBeTruthy("Today's date should be valid");
            expect(scope.myForm.dueDate.$error).toEqual({currentDate: false, validDate: false});
        });

    });
}());

