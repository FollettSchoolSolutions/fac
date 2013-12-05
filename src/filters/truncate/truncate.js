/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';

    /*
        Truncate filter
        https://gist.github.com/danielcsgomes/2478654

        Defaults:
          length = 200
          ending = "..."

        Example usage:

        var text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod";

        input: {{ text | truncate:14 }}
        output: Lorem ipsum...

        input: {{ text | truncate:50:"--"}}
        output: Lorem ipsum dolor sit amet, consectetur adipisic--

        @param string
        @param int, default = 200
        @param string, default = "..."
        @return string
     */
    angular.module('filters.truncate', [])
        .filter('fssTruncate', function () {
            return function (text, length, end) {
                if (isNaN(length)) {
                    length = 200;
                }
                if (end === undefined) {
                    end = '...';
                }
                if (text) {
                    //Replace encoded carriage return and tabs with a space
                    if (text.length - end.length <= length) {
                        return text;
                    } else {
                        return String(text).substring(0, length - end.length) + end;
                    }
                }
            };
        });
}());
