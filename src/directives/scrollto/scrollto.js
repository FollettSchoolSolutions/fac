(function (angular) {

  'use strict';

  angular.module('directives.scrollto', [])

    .directive('fssScrollTo', ['$window', function ($window) {
      return {
        restrict: 'A',
        scope: { scrollOn: '=scrollOn', condition: '=scrollIf' },
        link: function ($scope, $element) {
          $scope.$watch(function whenScrollOnAndConditionIsTrue() {
            return $scope.scrollOn && $scope.condition;
          }, function scrollToElementIfTrue(value) {
            if (value) {
              var yPositionOfElement = $element.position().top;
              $window.scrollTo(0, yPositionOfElement);
            }
          });
        }
      };
    }]);

}(angular));