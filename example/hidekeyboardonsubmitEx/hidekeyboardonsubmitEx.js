/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how fssfssHideKeyboardOnSubmit works.
 */
angular.module('hidekeyboardonsubmitEx', []).controller('hideKbController', ['$scope', '$timeout', function ($scope, $timeout) {
    var viewHelper = {}, first = {message: '', input: ''}, second = {message: '', input: ''};

    viewHelper.submit = function (formObject) {
        formObject["message"] = "Submitted";

        //wait a little and reset the message
        $timeout(function () {
            formObject["message"] = "";
            formObject["input"] = "";
        }, 3000);
    };
    $scope.viewHelper = viewHelper;
    $scope.first = first;
    $scope.second = second;
}]);
