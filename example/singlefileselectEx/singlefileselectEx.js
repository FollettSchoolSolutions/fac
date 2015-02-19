/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how fssDateInput works.  Sets up initial data to be displayed
 */
angular.module('singlefileselectEx', []).controller('FileSelectCtrl', ['$scope', '$window', function ($scope, $window) {
  var fileSelectCtrl = this;
  var fileReader = $window.FileReader && new $window.FileReader();

  fileSelectCtrl.myFile = null;

  fileSelectCtrl.onFileSelect = function () {
    if (fileSelectCtrl.myFile && fileSelectCtrl.previewIsSupported()) {
      fileReader.readAsDataURL(fileSelectCtrl.myFile);
    }
  };

  fileSelectCtrl.showPreview = function () {
    return !!fileSelectCtrl.imagePreviewSrc;
  };

  fileSelectCtrl.previewIsSupported = function () {
    return !!fileReader;
  };

  if (fileReader) {
    fileReader.onload = function (e) {
      $scope.$apply(function () {
        fileSelectCtrl.imagePreviewSrc = e.target.result;
      });
    };
  }
}]);