/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function (angular) {
    'use strict';

    /**
     * A bar graph module
     *
     * HTML Usage:
     *
     *     <div data-fss-bar-graph data-items="arrayOfitems"></div>
     * Where each item is like :
     * {count: 30, style: 'green'}
     * {count: 40, style: 'red'}
     * Style is an optional property which if specified will be applied to the vertical bar
     * This is useful for applying custom colors to each vertical bar graph on a per item basis
     * 
     * The graph will be constructed as a vertical graph, with each item representing 1 vertical bar, and the count dictates how tall a particular item 
     * will be drawn in relation to the other bars
     * @module directives.bargraph
     */
    angular.module('directives.bargraph', [])

        .directive('fssBarGraph', [function barGraphDirective() {
            return {

                restrict: 'A',

                scope: {
                    items: '=items',
                    customStyle: '='
                },

                template: '<div class="graph-container" data-ng-show="getTotal()">' +
                          '  <div class="bar" data-ng-class="item.style" ' +
                          '                   data-ng-repeat="item in items" ' +
                          '                   style="height: {{ getHeight(item) }}; width: {{ getWidth() }} "></div>' +
                          '</div>',

                replace: true,

                link: function link($scope) {

                    var MAX_BAR_HEIGHT_IN_PIXELS = 150,

                        GUTTER_WIDTH_IN_PERCENT = 2;

                    /**
                     * Get the total count of all the items
                     *
                     * @return {Number}
                     */
                    $scope.getTotal = function getTotal() {
                        var total = 0, i;
                        for (i = $scope.items.length - 1; i >= 0; i--) {
                            total += parseInt($scope.items[i].count, 10) || 0;
                        }

                        return total;
                    };

                    /**
                     * Get the height of this bar, relative to 150px
                     *
                     * @param  {Object} item
                     * @return {String} `height + "px"`
                     */
                    $scope.getHeight = function getHeight(item) {
                        var height = Math.ceil((item.count / $scope.getTotal()) * MAX_BAR_HEIGHT_IN_PIXELS);
                        return (height || 1) + "px";
                    };

                    /**
                     * Get the width of a bar
                     *
                     * @method getWidth
                     * @return {String} width + '%'
                     */
                    $scope.getWidth = function getWidth() {
                        var width = ((1 / $scope.items.length) * 100) - GUTTER_WIDTH_IN_PERCENT;
                        return width + '%';
                    };

                }

            };
        }]);

}(angular));
