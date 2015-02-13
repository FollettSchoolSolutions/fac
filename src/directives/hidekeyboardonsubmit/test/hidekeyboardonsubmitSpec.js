/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    describe('hideKeyboardOnSubmit', function () {
        var fakeWin, rootScope, compile;
        beforeEach(function () {
            var providerOverride;
            fakeWin = {document: {activeElement: {blur: jasmine.createSpy('blur')},
                createElement: function () {return null; }},
                navigator: {userAgent: {}}
                };
            providerOverride = function ($provide) {
                $provide.value('$window', fakeWin);
            };
            module('fss.directives.hidekeyboardonsubmit', providerOverride);
            inject(function ($rootScope, $compile) {
                rootScope = $rootScope;
                compile = $compile;
            });
        });
        it("Test that submit event on the form will cause the active element to blur", function () {
            var html, scope = rootScope.$new(), input;

            html = angular.element('<form data-fss-hide-keyboard-on-submit><input type="text"></form>');
            compile(html)(scope);
            rootScope.$digest();
            input = html.find('input');
            expect(fakeWin.document.activeElement.blur).not.toHaveBeenCalled();
            input.submit();
            expect(fakeWin.document.activeElement.blur).toHaveBeenCalled();
        });
    });
}());
