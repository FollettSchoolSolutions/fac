(function (angular) {
  'use strict';

  angular.module('fss.directives.singlefileselect', ['angularFileUpload'])

    .directive('fssSingleFileSelect', function ($parse) {
      return {
        restrict: 'A',
        template: '<input type="file" ng-file-select="onFileSelect($files)">',
        replace: true,
        require: ['ngModel', '^?form'],
        link: function ($scope, elem, attrs, ctrls) {
          var modelCtrl = ctrls[0];
          var formCtrl = ctrls[1];
          var modelGetter = $parse(attrs.ngModel);
          var modelSetter = modelGetter.assign;

          var customOnFileSelect = attrs.fssSingleFileSelect ? $parse(attrs.fssSingleFileSelect) : angular.noop;
          function updateNgModel($files) {
            modelSetter($scope, $files[0]);
            modelCtrl.$dirty = true;
            modelCtrl.$pristine = false;
            if (formCtrl) {
              formCtrl.$setDirty();
            }
          }
          $scope.onFileSelect = function ($files) {
            updateNgModel($files);
            customOnFileSelect($scope);
          };
        }
      };
    });

}(angular));