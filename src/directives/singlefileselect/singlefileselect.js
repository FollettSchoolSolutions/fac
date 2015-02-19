(function (angular) {
  'use strict';

  angular.module('fss.directives.singlefileselect', ['angularFileUpload'])

    .directive('fssSingleFileSelect', function ($parse) {
      return {
        restrict: 'A',
        template: '<input type="file" ng-file-select="onFileSelect($files)">',
        replace: true,
        require: 'ngModel',
        link: function ($scope, elem, attrs, ngModel) {
          var modelGetter = $parse(attrs.ngModel);
          var modelSetter = modelGetter.assign;

          var customOnFileSelect = attrs.fssSingleFileSelect ? $parse(attrs.fssSingleFileSelect) : angular.noop;
          function updateNgModel($files) {
            modelSetter($scope, $files[0]);
            ngModel.$setDirty();
          }
          $scope.onFileSelect = function ($files) {
            updateNgModel($files);
            customOnFileSelect($scope);
          };
        }
      };
    });

}(angular));