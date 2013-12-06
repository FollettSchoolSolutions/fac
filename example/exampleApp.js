/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * showExample app is the entry point module for the example page.  It includes as dependencies
 * each example we want to show
 * 
 * Sample directive takes the url of sample text to load and uses http://craig.is/making/rainbows/ to make the text
 * look nice.
 * Usage:
 * <pre data-sample="/test/example/sanitizeEx/sanitizeEx.js" data-language="javascript"></pre>
 */
angular.module('showExample', ['sanitizeEx', 'dateshimEx', 'hidekeyboardonsubmitEx', 'bargraphEx', 'truncateEx']).directive("sample", ['$http', '$timeout', function ($http, $timeout) {
    return {
        restrict: 'A',
        replace: false,
        link: function ($scope, element, attribs) {
            var promise, block = angular.element('<div></div>');

            //retrieve the sample based off the given url
            promise = $http.get(attribs.sample);
            
            //When the sample has been loaded, create a pre element in accordance with Rainbow's API.
            promise.then(function (result) {
                
                block = angular.element('<pre data-language="' + attribs.language + '">' + result.data.toString() + '</pre>');
                element.append(block);
                
            });
        }
    };
}])
.run(function ($timeout, $rootScope) {
	//Hack.  Rainbow was originally attempted to be called in the directive above, but instead of performing the 
	//operation on the current block, it ended up performing on the whole page.  This would sporadically cause 1 error to show up, probably due to
	//the DOM not being settled yet.  So this just waits for a few seconds before calling Rainbow to color the code blocks
	$timeout(function () {
        Rainbow.color();
        $rootScope.ready = true;
    }, 3000);
});
