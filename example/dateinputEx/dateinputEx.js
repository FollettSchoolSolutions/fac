/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how fssDateInput works.  Sets up initial data to be displayed
 */
angular.module('dateinputEx', []).controller('DateController', ['$scope', function ($scope) {
  $scope.date1 = new Date();
  $scope.date2 = new Date();
  $scope.date2.setDate($scope.date2.getDate() - 1);
  $scope.date3 = null;
}]);
