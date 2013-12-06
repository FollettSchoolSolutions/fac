/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how truncate filter works.
 */
angular.module('truncateEx', ['filters.truncate']).controller('truncateController', ['$scope', function ($scope) {
    $scope.text = "Here is some text that will be truncated because it is longer than the truncate number";
}]);
