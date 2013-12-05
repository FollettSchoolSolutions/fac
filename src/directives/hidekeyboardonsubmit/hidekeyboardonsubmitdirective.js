/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';

    angular.module('directives.hidekeyboardonsubmit', [])
        .directive('fssHideKeyboardOnSubmit', ['$window', function ($window) {
            return function (scope, element, attrs) {
                element.bind('submit', function () {
                    $window.document.activeElement.blur();
                });
            };
        }]);
}());
