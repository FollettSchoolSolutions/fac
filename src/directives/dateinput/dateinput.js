(function (angular) {
  'use strict';

  angular.module('directives.dateinput', ['ngMoment'])

    .directive('fssDateInput', ['$moment', '$window', function ($moment, $window) {
      return {
        require:'ngModel',
        restrict:'A',
        controller: angular.noop,
        link: function ($scope, element, attrs, modelCtrl) {
          var USER_FRIENDLY_FORMAT, USER_FRIENDLY_PARSING_FORMAT, ISO_FORMAT, canUseDatePicker;
          USER_FRIENDLY_FORMAT = 'MM/DD/YYYY';
          USER_FRIENDLY_PARSING_FORMAT = 'M/D/YYYY';
          ISO_FORMAT = 'YYYY-MM-DD';
          canUseDatePicker = $window.Modernizr.inputtypes.date;

          if (canUseDatePicker) {
            attrs.$set('type', 'date');
          } else {
            attrs.$set('type', 'text');
          }

          function formatDate(modelValue) {
            var dateString = '';

            if (modelValue) {
              if (canUseDatePicker) {
                dateString = $moment(modelValue).format(ISO_FORMAT);
              } else {
                dateString = $moment(modelValue).format(USER_FRIENDLY_FORMAT);
              }
            }
            return dateString;
          }

          function parseDate(viewValue) {
            var moment = null, modelValue = null, isValid = true, parseStrict = true;
            if (viewValue) {
              if (canUseDatePicker) {
                moment = $moment(viewValue, ISO_FORMAT, parseStrict);
              } else {
                moment = $moment(viewValue, USER_FRIENDLY_PARSING_FORMAT, parseStrict);
              }
              isValid = moment.isValid();
              if (isValid) {
                modelValue = moment.toDate();
              }
            }
            modelCtrl.$setValidity('invalidDate', isValid);
            return modelValue;
          }

          modelCtrl.$formatters.unshift(formatDate);
          modelCtrl.$parsers.unshift(parseDate);
        }
      };
    }])

    .directive('fssTodayOrLater', ['$moment', function ($moment) {
      return {
        restrict: 'A',
        require: ['ngModel', 'fssDateInput'],
        link: function ($scope, element, attrs, ctrls) {
          var modelCtrl = ctrls[0];
          function isDateInPast(date) {
            var isInPast = false, userMoment, currentMoment;
            if (date) {
              userMoment = $moment(date).startOf('day');
              if (userMoment.isValid()) {
                currentMoment = $moment().startOf('day');
                //Determine the difference in days between the user's expiration date and the current date
                if (userMoment.diff(currentMoment, 'days') < 0) {
                  isInPast = true;
                }
              }
            }
            return isInPast;
          }
          function validate(modelValue) {
            var isValid = !isDateInPast(modelValue);
            modelCtrl.$setValidity('dateInPast', isValid);
          }
          $scope.$watch(attrs.ngModel, validate);
        }
      };
    }])

    .directive('fssEndOfDay', ['$moment', function ($moment) {
      return {
        restrict: 'A',
        require: ['ngModel', 'fssDateInput'],
        link: function ($scope, element, attrs, ctrls) {
          var modelCtrl = ctrls[0];
          function parseDate(date) {
            if (date) {
              //Set to last second of day in the current time zone.
              date = $moment(date).endOf('day').toDate();
            }
            return date;
          }
          modelCtrl.$parsers.push(parseDate);
        }
      };
    }]);
}(angular));