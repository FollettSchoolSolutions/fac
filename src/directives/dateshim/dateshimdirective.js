/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
/**
 * 
 * Date shim creates a date entry field that will utilize the browser's native date picker.
 * If the browser does not support the datepicker, then it becomes a text entry field that requires
 * mm/dd/yyyy.  In either case, ng-model associated with the directive will store the date in the ISO8601
 * format (yyyy-mm-dd).  For the case of browsers which do not support the native date picker, the model will
 * remain null until a valid date has been entered.
 */
    angular.module('directives.dateshim', ['fss.services.datetime', 'partials'])
        .directive('fssDateShim', ['DateTimeService', function (dts) {
            return {
                restrict: 'A',
                replace: false,
                //create an iso scope, and setup bi-di binding between scope.model and the ng-model of the parent scope 
                scope: {model: "=ngModel"},
                templateUrl: 'directives/dateshim/dateshim.html',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    var dateField = element.find('input[name="dateShimNativePicker"]'),
                        modelValue = null,
                        startingDate = null,
                        startingDateFormatted = null,
                        nativePicker = true;
                    //hack to keep the ngModel from the parent scope in sync with our copy of the ngModel on our isolate scope
                    //see http://stackoverflow.com/questions/15269737/why-is-ngmodel-setviewvalue-not-working-from
                    scope.$watch('model', function () {
                        scope.$eval(attrs.ngModel + "= model");
                    });
                    scope.$watch(attrs.ngModel, function (val) {
                        scope.model = val;
                    });

                    //Determine whether we have native date picker support
                    if (attrs.nativePicker && attrs.nativePicker === 'false') {
                        nativePicker = false;
                    }
                    scope.pickerSupported = nativePicker;

                    //initialize the models that hold the user input
                    scope.unclean = {text: null};
                    scope.clean = {text: null};

                    //Check to see if the model is set initially.  If so, convert it to the displayable date
                    //and set the input fields with the initial values in the formats they expect them
                    modelValue = scope.model;
                    if (modelValue) {
                        startingDate = dts.parseDateISO8601(modelValue);
                        startingDateFormatted = dts.formatDate(startingDate);
                        scope.unclean.text = startingDateFormatted;
                        scope.clean.text = modelValue;
                    }
                    /**
                     * Watch the unclean model.  This is input from the text input field expecting
                     * input in the mm/dd/yyyy format
                     * Changes are tested to see if it is a valid date.  If so, then we format it in ISO8601
                     * and set the model with the ISO8601 date string
                     */
                    scope.$watch('unclean.text', function (newVal, oldVal) {
                        var d;
                        if (dts.isValidDate(newVal)) {
                            d = new Date(newVal);
                            ngModelCtrl.$setViewValue(dts.formatDateISO8601(d));
                        } else {
                            ngModelCtrl.$setViewValue(null);
                        }

                    });
                    //On blur of the date picker field, we need to update the clean model.  This is due to iPads
                    //not triggering a change event when a date is chosen.  The other browsers behave normally and keep
                    //the clean model up to date.
                    dateField.blur(function () {
                        scope.$apply(function () {
                            scope.clean.text = dateField.val();
                        });
                    });

                    /**
                     * Watch the clean model.  This will be set by the native date picker, and it will be set in
                     * the ISO8601 format.
                     *
                     */
                    scope.$watch('clean.text', function (newVal, oldVal) {
                        ngModelCtrl.$setViewValue(newVal);
                    });
                }
            };
        }])
        /**
         * Validator that checks if the model is being set with an iso8601 date and sets an error
         * property if it is not a valid date.  *Note: this validator/parser will return a null
         * if an error occurs, which will effectively null out the model, preventing it from being set
         * with an invalid ISO date
         */
        .directive('isoDate', ['DateTimeService', function (dts) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    var validDate, retVal;
                    ngModelCtrl.$parsers.unshift(function (viewValue) {
                        validDate = true;
                        retVal = viewValue;
                        try {
                            dts.parseDateISO8601(viewValue);
                        } catch (e) {
                            //Caught exception parsing the date.  This means it was not in the ISO8601 format
                            //and will be considered an invalid date
                            validDate = false;
                            retVal = null;
                        }
                        ngModelCtrl.$setValidity('validDate', validDate);
                        return retVal;
                    });
                }
            };
        }])
        /**
         * Validator that checks if the date is today or later and sets an error property
         * if it is in the past.  *Note: this validator will pass back the date even if it is in the past,
         * so a model would be updated with the corresponding past date.
         */
        .directive('future', ['DateTimeService', function (dts) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    var viewDate = null, today = null, currentDate, retVal = null;
                    ngModelCtrl.$parsers.unshift(function (viewValue) {
                        currentDate = false;
                        retVal = null;
                        today = new Date();

                        try {
                            viewDate = dts.parseDateISO8601(viewValue);
                            if (dts.compareDates(today, viewDate) <= 0) {
                                currentDate = true;
                            } else {
                                currentDate = false;
                            }
                            retVal = viewValue;
                        } catch (e) {
                            //Caught exception parsing the date.  This means it was not in the ISO8601 format
                        }
                        ngModelCtrl.$setValidity('currentDate', currentDate);
                        return retVal;
                    });
                }
            };
        }]);
}());
