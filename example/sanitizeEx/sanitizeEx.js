/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how fssSanitize works.  Sets up initial data to be displayed
 */
angular.module('sanitizeEx', []).controller('SanitizeController', ['$scope', function ($scope) {
    var viewHelper = {};
    viewHelper.userInput = "<div><span style='color: red'>This is text</span></div>";
    $scope.viewHelper = viewHelper;
}]);
