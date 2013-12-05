/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    describe('fss sanitize', function () {
        var sanitize, rootScope, compile;
        beforeEach(function () {
            module('fssSanitize');
            inject(function (fssSanitize, $rootScope, $compile) {
                sanitize = fssSanitize;
                rootScope = $rootScope;
                compile = $compile;
            });
        });

        it('sanitize function removes html from the passed argument', function () {
            var html = '<div><p>Hello World!</p>b></div><img src="something/img.jpg" alt="a>">',
                filteredResult = sanitize(html);
            expect(filteredResult).toBe('Hello World!b&gt;', 'Should return "Hello World!b&gt;"');
        });
        it('sanitize removes script tag from the passed argument', function () {
            var html = '<script src="/javascripts/aspen/somedir/something.js"></script>',
                filteredResult = sanitize(html);
            expect(filteredResult).toBe('', 'should strip out script tags');
        });
        it('sanitize removes the style tag from passed argument', function () {
            var html = '<style>p {margin-left: 3px;}</style>',
                filteredResult = sanitize(html);
            expect(filteredResult).toBe('', 'should strip out style tags');
        });
        it("Test that sanitize inserts into html when parsing succeeds", function () {
            var html;
            html = angular.element('<div data-fss-bind-html="myText"></div>');
            rootScope.myText = '<div>hello & goodbye</div>';
            compile(html)(rootScope.$new());
            rootScope.$digest();

            expect(html.text()).toBe("hello & goodbye");
            expect(html.html()).toBe("hello &amp; goodbye");
        });

        it("Test that sanitize inserts escaped text when parsing fails", function () {
            var html;
            html = angular.element('<div data-fss-bind-html="myText"></div>');
            rootScope.myText = 'is 3 < 4? <div>hello</div>';
            compile(html)(rootScope.$new());
            rootScope.$digest();

            expect(html.text()).toBe("is 3 < 4? <div>hello</div>");
            expect(html.html()).toBe("is 3 &lt; 4? &lt;div&gt;hello&lt;/div&gt;");
        });
    });
}());
