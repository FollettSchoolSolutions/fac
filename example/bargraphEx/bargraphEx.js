/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how fssBargraph works.
 */
angular.module('bargraphEx', []).controller('bargraphController', ['$scope', function ($scope) {
    var items = [], temp = {name: "", number: 0};
    function createItem(name, count, style) {
        return {text: name, count: count, style: style || 'blue-bar'};
    }
    items.push(createItem("Volvo", 30));
    items.push(createItem("Toyota", 10, 'green-bar'));
    items.push(createItem("Chrysler", 40));
    items.push(createItem("Kia", 3));
    $scope.items = items;
    $scope.addItem = function () {
        items.push(createItem(temp.name, temp.number));
        temp.name = "";
        temp.number = 0;
    };
    $scope.temp = temp;
}]);
