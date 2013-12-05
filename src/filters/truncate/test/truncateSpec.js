/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    describe('truncate filter', function () {
        var truncate, shortText, longText;
        beforeEach(function () {
            module('filters.truncate');
            inject(function ($filter) {
                truncate = $filter('fssTruncate');
            });
            // this is 57 characters long
            shortText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.';
            // this is 229 characters
            longText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas laborum veniam. Facilis sunt iste laboriosam alias corrupti provident aperiam ad nesciunt inventore dignissimos fugit molestias sint natus neque asperiores quibusdam?';
        });
        it('length checking', function () {
            expect(shortText.length).toBe(57, 'confirm original shortText length = 57');

            // {{ shortText|truncate }}
            expect(truncate(shortText).length).toBe(57, 'shortText|truncate length should still be 57');

            expect(longText.length).toBe(229, 'confirm original longText length = 229');

            // {{ longText|truncate }}
            expect(truncate(longText).length).toBe(200, 'longText|truncate length should be 200');

            // {{ longText|truncate:50 }}
            expect(truncate(longText, 50).length).toBe(50, 'longText|truncate:50 length should be 50');

            // {{ longText|truncate:200:', you know?' }}
            expect(truncate(longText, 200, ', you know?').length).toBe(200, 'longText|truncate:200:", you know?" length should be 200');
        });

        it('ending checking', function () {
            var truncatedText = truncate(longText);
            expect(truncatedText.substring(truncatedText.length - 3)).toBe('...', 'longText|truncate should end with `...`');

            truncatedText = truncate(longText, 200, ', ya know');
            expect(truncatedText.substring(truncatedText.length - 9)).toBe(', ya know', 'longText|truncate:200:", ya know" should end with `, ya know`');
        });
    });
}());
