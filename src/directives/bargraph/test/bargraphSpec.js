/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    describe('BarGraphDirective', function () {
        var testData, $scope, $compile;
        beforeEach(function () {
            module('fss.directives.bargraph');
            inject(['$rootScope', '$compile', function (rootScope, compile) {
                $scope = rootScope.$new();
                $compile = compile;
            }]);

            testData = {};
            //Text attribute is not necessary, but it helps to have the data labeled when debugging
            testData.items = [
                { text: 'Oranges',  count: 25 },
                { text: 'Bananas',  count: 20 },
                { text: 'Apples',   count: 40, style: "fisk"},
                { text: 'Grapes',   count: 15 },
                { text: 'Mangos',   count: 0  }
            ];
            testData.dataPoints = 100; //(sum of all items counts (25 + 20 + 40 +  15)
        });
        it('classes are set right', function () {
            var directive;

            $scope.items = testData.items;
            directive = $compile('<div data-fss-bar-graph data-items="items"></div>')($scope);
            $scope.$apply();

            expect(directive.hasClass('graph-container')).toBeTruthy('has the "graph-container" class');
            expect(directive.children('.bar').length).toBe(5, 'there should be 5 bars');
            expect(directive.children('.bar.fisk').length).toBe(1, 'and only one of them should have the fisk class');
        });

        it('getHeight returns % of 150px', function () {
            var directive, height, directiveScope, apple, percent;

            $scope.items = testData.items;
            directive = $compile('<div data-fss-bar-graph data-items="items" ></div>')($scope);
            $scope.$apply();
            directiveScope = directive.children().scope();

            // tallest bar (should be 35% of 150px, rounded up)
            apple = testData.items[2];
            height = directiveScope.getHeight(apple);
            percent = apple.count / testData.dataPoints; // 0.35
            expect(height).toBe(Math.ceil(percent * 150) + 'px', 'height should be percentage of 150px');
        });

        it('getHeight returns 1px if the choice does not have a count', function () {
            var directive, height, directiveScope, mango;

            $scope.items = testData.items;
            directive = $compile('<div data-fss-bar-graph data-items="items"></div>')($scope);
            $scope.$apply();
            directiveScope = directive.children().scope();

            // shortest bar (no counts, so should be 1px)
            // note: we don't want 0px because we want to show *something* to indicate it's a choice
            mango = testData.items[4];
            height = directiveScope.getHeight(mango);
            expect(height).toBe('1px', 'height should be 1px for a choice with no count');
        });

        it('getWidth returns ((1 / total) - 2)%', function () {
            var directive, directiveScope, total = 0, idx;

            $scope.items = testData.items;
            directive = $compile('<div data-fss-bar-graph data-items="items"></div>')($scope);
            $scope.$apply();
            directiveScope = directive.children().scope();

            for (idx = testData.items.length - 1; idx >= 0; idx--) {
                total += testData.items[idx].count;
            }

            for (idx = testData.items.length - 1; idx >= 0; idx--) {
                expect(directiveScope.getWidth(testData.items[idx])).toBe('18%', 'width should be 18%');
            }

        });

        it('hide the bar graph if there are not any data points', function () {
            var directive, html;
            html = '<div data-fss-bar-graph data-items="items"></div>';

            $scope.items = [{ text: 'Something', count: 0 },
                              { text: 'Whatever', count: 0}];
            directive = $compile(html)($scope);
            $scope.$apply();

            expect(directive.hasClass('ng-hide')).toBeTruthy('graph should be hidden there are no items');

            $scope.items = [{ text: 'Something', count: 1 },
                              { text: 'Whatever', count: 1}];
            $scope.$apply();

            expect(directive.hasClass('ng-hide')).toBeFalsy('but should be cool if there *are* data points');
        });

    });

}());
