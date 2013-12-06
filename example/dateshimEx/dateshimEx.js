/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how fssDateShim works.  Sets up initial data to be displayed
 */
angular.module('dateshimEx', ['directives.dateshim']).controller('DateController', ['$scope', function ($scope) {
	$scope.simple = "2010-07-04";
	$scope.simpleText = "2010-07-05";
}]);
