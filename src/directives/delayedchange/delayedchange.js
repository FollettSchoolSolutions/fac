(function (angular) {
  'use strict';

  var DEFAULT_DELAY = 1000;

  angular.module('fss.directives.delayedchange', [])

    // Directive that waits until changes stop for a specified time interval
    // before executing the expression.
    .directive('fssDelayedChange', ['$timeout', '$parse', function ($timeout, $parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {
          var promise, delay, onDelayedChange;
          delay = parseInt(attrs.delay, 10) || DEFAULT_DELAY;
          onDelayedChange = $parse(attrs.fssDelayedChange);
          ctrl.$viewChangeListeners.push(function () {
            $timeout.cancel(promise);
            promise = $timeout(function () {
              onDelayedChange($scope);
            }, delay);
          });
        }
      };
    }]);
}(angular));