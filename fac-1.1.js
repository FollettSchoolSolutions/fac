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
/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
/**
 * 
 * Date shim creates a date entry field that will utilize the browser's native date picker.
 * If the browser does not support the datepicker, then it becomes a text entry field that requires
 * mm/dd/yyyy.  In either case, ng-model associated with the directive will store the date in the ISO8601
 * format (yyyy-mm-dd).  For the case of browsers which do not support the native date picker, the model will
 * remain null until a valid date has been entered.
 */
    angular.module('directives.dateshim', ['fss.services.datetime', 'partials'])
        .directive('fssDateShim', ['DateTimeService', function (dts) {
            return {
                restrict: 'A',
                replace: false,
                //create an iso scope, and setup bi-di binding between scope.model and the ng-model of the parent scope 
                scope: {model: "=ngModel"},
                templateUrl: 'directives/dateshim/dateshim.html',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    var dateField = element.find('input[name="dateShimNativePicker"]'),
                        modelValue = null,
                        startingDate = null,
                        startingDateFormatted = null,
                        nativePicker = true;
                    //hack to keep the ngModel from the parent scope in sync with our copy of the ngModel on our isolate scope
                    //see http://stackoverflow.com/questions/15269737/why-is-ngmodel-setviewvalue-not-working-from
                    scope.$watch('model', function () {
                        scope.$eval(attrs.ngModel + "= model");
                    });
                    scope.$watch(attrs.ngModel, function (val) {
                        scope.model = val;
                    });

                    //Determine whether we have native date picker support
                    if (attrs.nativePicker && attrs.nativePicker === 'false') {
                        nativePicker = false;
                    }
                    scope.pickerSupported = nativePicker;

                    //initialize the models that hold the user input
                    scope.unclean = {text: null};
                    scope.clean = {text: null};

                    //Check to see if the model is set initially.  If so, convert it to the displayable date
                    //and set the input fields with the initial values in the formats they expect them
                    modelValue = scope.model;
                    if (modelValue) {
                        startingDate = dts.parseDateISO8601(modelValue);
                        startingDateFormatted = dts.formatDate(startingDate);
                        scope.unclean.text = startingDateFormatted;
                        scope.clean.text = modelValue;
                    }
                    /**
                     * Watch the unclean model.  This is input from the text input field expecting
                     * input in the mm/dd/yyyy format
                     * Changes are tested to see if it is a valid date.  If so, then we format it in ISO8601
                     * and set the model with the ISO8601 date string
                     */
                    scope.$watch('unclean.text', function (newVal, oldVal) {
                        var d;
                        if (dts.isValidDate(newVal)) {
                            d = new Date(newVal);
                            ngModelCtrl.$setViewValue(dts.formatDateISO8601(d));
                        } else {
                            ngModelCtrl.$setViewValue(null);
                        }

                    });
                    //On blur of the date picker field, we need to update the clean model.  This is due to iPads
                    //not triggering a change event when a date is chosen.  The other browsers behave normally and keep
                    //the clean model up to date.
                    dateField.blur(function () {
                        scope.$apply(function () {
                            scope.clean.text = dateField.val();
                        });
                    });

                    /**
                     * Watch the clean model.  This will be set by the native date picker, and it will be set in
                     * the ISO8601 format.
                     *
                     */
                    scope.$watch('clean.text', function (newVal, oldVal) {
                        ngModelCtrl.$setViewValue(newVal);
                    });
                }
            };
        }])
        /**
         * Validator that checks if the model is being set with an iso8601 date and sets an error
         * property if it is not a valid date.  *Note: this validator/parser will return a null
         * if an error occurs, which will effectively null out the model, preventing it from being set
         * with an invalid ISO date
         */
        .directive('isoDate', ['DateTimeService', function (dts) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    var validDate, retVal;
                    ngModelCtrl.$parsers.unshift(function (viewValue) {
                        validDate = true;
                        retVal = viewValue;
                        try {
                            dts.parseDateISO8601(viewValue);
                        } catch (e) {
                            //Caught exception parsing the date.  This means it was not in the ISO8601 format
                            //and will be considered an invalid date
                            validDate = false;
                            retVal = null;
                        }
                        ngModelCtrl.$setValidity('validDate', validDate);
                        return retVal;
                    });
                }
            };
        }])
        /**
         * Validator that checks if the date is today or later and sets an error property
         * if it is in the past.  *Note: this validator will pass back the date even if it is in the past,
         * so a model would be updated with the corresponding past date.
         */
        .directive('future', ['DateTimeService', function (dts) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    var viewDate = null, today = null, currentDate, retVal = null;
                    ngModelCtrl.$parsers.unshift(function (viewValue) {
                        currentDate = false;
                        retVal = null;
                        today = new Date();

                        try {
                            viewDate = dts.parseDateISO8601(viewValue);
                            if (dts.compareDates(today, viewDate) <= 0) {
                                currentDate = true;
                            } else {
                                currentDate = false;
                            }
                            retVal = viewValue;
                        } catch (e) {
                            //Caught exception parsing the date.  This means it was not in the ISO8601 format
                        }
                        ngModelCtrl.$setValidity('currentDate', currentDate);
                        return retVal;
                    });
                }
            };
        }]);
}());
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
/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
	//'use strict';

	/**
	 * @ngdoc overview
	 * @name fssSanitize
	 * @description
	 * This was cloned from the ngSanitize module, and all whitelisted items were removed. The purpose is to remove
	 * all html entities, leaving only the plain text.
	 */

	/*
	 * HTML Parser By Misko Hevery (misko@hevery.com)
	 * based on:  HTML Parser By John Resig (ejohn.org)
	 * Original code by Erik Arvidsson, Mozilla Public License
	 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
	 *
	 * // Use like so:
	 * htmlParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 *
	 */

	var fsssanitize = function (html) {
	    var buf = [];
	    htmlParser(html, htmlSanitizeWriter(buf));
	    return buf.join('');
	};


	// Regular Expressions for parsing tags and attributes
	var START_TAG_REGEXP = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
        END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
	    ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
	    BEGIN_TAG_REGEXP = /^</,
	    BEGING_END_TAGE_REGEXP = /^<\s*\//,
	    COMMENT_REGEXP = /<!--(.*?)-->/g,
	    CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
	    URI_REGEXP = /^((ftp|https?):\/\/|mailto:|#)/,
	    NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g; // Match everything outside of normal chars and " (quote character)


	// Good source of info about elements and attributes
	// http://dev.w3.org/html5/spec/Overview.html#semantics
	// http://simon.html5.org/html-elements

	// Safe Void Elements - HTML5
	// http://dev.w3.org/html5/spec/Overview.html#void-elements
	var voidElements = makeMap("");

	// Elements that you can, intentionally, leave open (and which close themselves)
	// http://dev.w3.org/html5/spec/Overview.html#optional-tags
	var optionalEndTagBlockElements = makeMap(""),
	    optionalEndTagInlineElements = makeMap("rp,rt"),
	    optionalEndTagElements = angular.extend({}, optionalEndTagInlineElements, optionalEndTagBlockElements);

	// Safe Block Elements - HTML5
	var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap(""));

	// Inline Elements - HTML5
	var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap(""));


	// Special Elements (can contain anything)
	var specialElements = makeMap("script,style");

	var validElements = angular.extend({}, voidElements, blockElements, inlineElements, optionalEndTagElements);

	//Attributes that have href and hence need to be sanitized
	var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
	var validAttrs = angular.extend({}, uriAttrs, makeMap(
	    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
	    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
	    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
	    'scope,scrolling,shape,span,start,summary,target,title,type,'+
	    'valign,value,vspace,width'));

	function makeMap(str) {
	  var obj = {}, items = str.split(','), i;
	  for (i = 0; i < items.length; i++) {obj[items[i]] = true;}
	  return obj;
	}


	/**
	 * @example
	 * htmlParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 *
	 * @param {string} html string
	 * @param {object} handler
	 */
	function htmlParser( html, handler ) {
	  var index, chars, match, stack = [], last = html;
	  stack.last = function() { return stack[ stack.length - 1 ]; };

	  while ( html ) {
	    chars = true;

	    // Make sure we're not in a script or style element
	    if ( !stack.last() || !specialElements[ stack.last() ] ) {

	      // Comment
	      if ( html.indexOf("<!--") === 0 ) {
	        index = html.indexOf("-->");

	        if ( index >= 0 ) {
	          if (handler.comment){handler.comment( html.substring( 4, index ) );}
	          html = html.substring( index + 3 );
	          chars = false;
	        }

	      // end tag
	      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
	        match = html.match( END_TAG_REGEXP );

	        if ( match ) {
	          html = html.substring( match[0].length );
	          match[0].replace( END_TAG_REGEXP, parseEndTag );
	          chars = false;
	        }

	      // start tag
	      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
	        match = html.match( START_TAG_REGEXP );

	        if ( match ) {
	          html = html.substring( match[0].length );
	          match[0].replace( START_TAG_REGEXP, parseStartTag );
	          chars = false;
	        }
	      }

	      if ( chars ) {
	        index = html.indexOf("<");

	        var text = index < 0 ? html : html.substring( 0, index );
	        html = index < 0 ? "" : html.substring( index );

	        if (handler.chars){handler.chars( decodeEntities(text) );}
	      }

	    } else {
	      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'), function(all, text){
	        text = text.
	          replace(COMMENT_REGEXP, "$1").
	          replace(CDATA_REGEXP, "$1");

	        if (handler.chars){handler.chars( decodeEntities(text) );}

	        return "";
	      });

	      parseEndTag( "", stack.last() );
	    }

	    if ( html == last ) {
	      throw "Parse Error: " + html;
	    }
	    last = html;
	  }

	  // Clean up any remaining tags
	  parseEndTag();

	  function parseStartTag( tag, tagName, rest, unary ) {
	    tagName = angular.lowercase(tagName);
	    if ( blockElements[ tagName ] ) {
	      while ( stack.last() && inlineElements[ stack.last() ] ) {
	        parseEndTag( "", stack.last() );
	      }
	    }

	    if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
	      parseEndTag( "", tagName );
	    }

	    unary = voidElements[ tagName ] || !!unary;

	    if ( !unary ){stack.push( tagName );}

	    var attrs = {};

	    rest.replace(ATTR_REGEXP, function(match, name, doubleQuotedValue, singleQoutedValue, unqoutedValue) {
	      var value = doubleQuotedValue
	        || singleQoutedValue
	        || unqoutedValue
	        || '';

	      attrs[name] = decodeEntities(value);
	    });
	    if (handler.start){handler.start( tagName, attrs, unary );}
	  }

	  function parseEndTag( tag, tagName ) {
	    var pos = 0, i;
	    tagName = angular.lowercase(tagName);
	    if ( tagName ) {
            // Find the closest opened tag of the same type
              for ( pos = stack.length - 1; pos >= 0; pos-- ) {
                if ( stack[ pos ] == tagName ) {
                    break;
                }
            }
        }

	    if ( pos >= 0 ) {
	      // Close all the open elements, up the stack
	      for ( i = stack.length - 1; i >= pos; i-- ) {
            if (handler.end){handler.end( stack[ i ] );}
        }

	      // Remove the open elements from the stack
	      stack.length = pos;
	    }
	  }
	}

	/**
	 * decodes all entities into regular string
	 * @param value
	 * @returns {string} A string with decoded entities.
	 */
	var hiddenPre=document.createElement("pre");
	function decodeEntities(value) {
	  hiddenPre.innerHTML=value.replace(/</g,"&lt;");
	  return hiddenPre.innerText || hiddenPre.textContent || '';
	}

	/**
	 * Escapes all potentially dangerous characters, so that the
	 * resulting string can be safely inserted into attribute or
	 * element text.
	 * @param value
	 * @returns escaped text
	 */
	function encodeEntities(value) {
	  return value.
	    replace(/&/g, '&amp;').
	    replace(NON_ALPHANUMERIC_REGEXP, function(value){
	      return '&#' + value.charCodeAt(0) + ';';
	    }).
	    replace(/</g, '&lt;').
	    replace(/>/g, '&gt;');
	}

	/**
	 * create an HTML/XML writer which writes to buffer
	 * @param {Array} buf use buf.jain('') to get out sanitized html string
	 * @returns {object} in the form of {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * }
	 */
	function htmlSanitizeWriter(buf){
	  var ignore = false;
	  var out = angular.bind(buf, buf.push);
	  return {
	    start: function(tag, attrs, unary){
	      tag = angular.lowercase(tag);
	      if (!ignore && specialElements[tag]) {
	        ignore = tag;
	      }
	      if (!ignore && validElements[tag] == true) {
	        out('<');
	        out(tag);
	        angular.forEach(attrs, function(value, key){
	          var lkey=angular.lowercase(key);
	          if (validAttrs[lkey]==true && (uriAttrs[lkey]!==true || value.match(URI_REGEXP))) {
	            out(' ');
	            out(key);
	            out('="');
	            out(encodeEntities(value));
	            out('"');
	          }
	        });
	        out(unary ? '/>' : '>');
	      }
	    },
	    end: function(tag){
	        tag = angular.lowercase(tag);
	        if (!ignore && validElements[tag] == true) {
	          out('</');
	          out(tag);
	          out('>');
	        }
	        if (tag == ignore) {
	          ignore = false;
	        }
	      },
	    chars: function(chars){
	        if (!ignore) {
	          out(encodeEntities(chars));
	        }
	      }
	  };
	}

	//define fssSanitize module and register $fssSanitize service
	angular.module('fssSanitize', []).value('fssSanitize', fsssanitize);
	
	/** fssBindHtml directive
	 * Usage:
	 * <div data-fss-bind-html="object.unsafeTextInHere"></div>
	 * This will cause all html to be removed from the unsafeTextInHere and stuck within the div
	 * 
	 */
	angular.module('fssSanitize').directive('fssBindHtml', ['fssSanitize', function(fssSanitize) {
	  return function(scope, element, attr) {
	    element.addClass('ng-binding').data('$binding', attr.fssBindHtml);
	    scope.$watch(attr.fssBindHtml, function ngBindHtmlWatchAction(value) {
	        var parseFailed = false;
	        try {
	            value = fsssanitize(value);
	        } catch (e) {
	            parseFailed = true;
	        }
	      //if we failed to sanitize, then we don't want to allow the browser to interpret possible markup
	      //so we'll set the text of the node.  If we did parse, then we can safely set using html, which
	      //inserts the literal text as the html of the node.
	      if (parseFailed) {
	          element.text(value || '');
	      } else {
	          element.html(value || '');
	      }
	    });
	  };
	}]);
}());
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
/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

(function () {
    'use strict';
    /**
     * DateTimeService helps with some of the date manipulation needed by the library.  
     * Note: it is deficient at the time of writing.  It does not respect locale.  It assumes that a formatted date will be of form
     * mm/dd/yyyy and that a valid date will be in that format as well.
     * The other methods related to iso8601 perform as expected.
     * @module services.datetime
     */
    angular.module('fss.services.datetime', [])

        .factory('DateTimeService', [function () {
            var spec = {}, service = {},
                DATE_SEPARATOR = "/";

            /**
             * Tests whether date conforms to mm/dd/yyyy format.  
             * @param dateStr a date string to validate
             * @returns {Boolean} for whether the passed string is a valid, parsable date.
             */
            service.isValidDate = function (dateStr) {
                var valid = false,
                    pattern = new RegExp("^\\d{1,2}/\\d{1,2}/\\d{4}$"),
                    patternResult = false,
                    result = null;
                if (dateStr) {
                    result = spec.parseDate(dateStr);
                    if (dateStr && dateStr.match(pattern)) {
                        patternResult = true;
                    }
                    if (result !== null && result.length === 3 && patternResult) {
                        valid = true;
                    }
                }
                return valid;
            };
            /*
             * Parses out the date string passed in.
             * If invalid, null is returned
             * If valid, an array of [year, month, day] is returned
             */
            spec.parseDate = function (dateStr) {
                var rawValue = dateStr.trim(),
                    cleanDate,
                    parsedDateMillis,
                    parsedDate,
                    retVal = null;
                //Only check the date if it is not an empty string
                if (rawValue !== '' && rawValue !== null) {
                    cleanDate = rawValue;

                    parsedDateMillis = Date.parse(cleanDate);

                    if (parsedDateMillis !== null && !isNaN(parsedDateMillis)) {
                        parsedDate = new Date(parsedDateMillis);
                        retVal = [parsedDate.getFullYear(), parsedDate.getMonth() + 1, parsedDate.getDate()];
                    }
                }
                return retVal;
            };

            /**
             * Helper to left pad numbers < 10 with '0'
             */
            function pad(num) {
                var padded = "";
                padded = num.toString();
                if (num < 10) {
                    padded = "0" + num.toString();
                }
                return padded;
            }
            /**
             *
             * @param date A javascript Date object
             * @returns {String} the date in a string format (MM/DD/YYYY)
             */
            service.formatDate = function (date) {
                if (!date) {
                    return "";
                } else {
                    return (pad(date.getMonth() + 1)) + DATE_SEPARATOR + pad(date.getDate()) + DATE_SEPARATOR + date.getFullYear();
                }
            };
            /**
             *
             * @param date A javascript Date object
             * @returns {String} the date in a string format according to the iso8601 spec (YYYY-MM-DD)
             */
            service.formatDateISO8601 = function (date) {
                if (!date) {
                    return "";
                } else {
                    return date.getFullYear() + "-" + pad((date.getMonth() + 1)) + "-" + pad(date.getDate());
                }
            };

            /**
             * Parses the date from ISO8601 form (2000-1-01) to a Date.
             *
             * @method parseDateISO8601
             * @param dateStr
             * @returns {Date}
             */
            service.parseDateISO8601 = function parseDateISO8601(dateStr) {
                var parsedDateStr = dateStr.split("-"), year, month, date;
                if (!parsedDateStr || parsedDateStr.length !== 3 || parsedDateStr[0].length < 4) {
                    throw new Error("Invalid date format.");
                } else {
                    year = parseInt(parsedDateStr[0], 10);
                    month = parseInt(parsedDateStr[1] - 1, 10);
                    date = parseInt(parsedDateStr[2], 10);
                    return new Date(year, month, date);
                }
            };

            /**
             * Returns -1 if the first date is before the second, 0 if equal
             * and 1 if after. This method only compares the date portion of
             * JavaScript Date objects. It does not consider their time.
             *
             * @method compareDates
             * @param {Date} date1
             * @param {Date} date2
             * @returns {Number}
             */
            service.compareDates = function compareDates(date1, date2) {
                if (date1.getFullYear() > date2.getFullYear()) {
                    return 1;
                } else if (date1.getFullYear() < date2.getFullYear()) {
                    return -1;
                } else if (date1.getMonth() > date2.getMonth()) {
                    return 1;
                } else if (date1.getMonth() < date2.getMonth()) {
                    return -1;
                } else if (date1.getDate() > date2.getDate()) {
                    return 1;
                } else if (date1.getDate() < date2.getDate()) {
                    return -1;
                }

                return 0;
            };
            return service;
        }]);
}());
angular.module("directives/dateshim/dateshim.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/dateshim/dateshim.html",
    "<div data-ng-show=\"pickerSupported\">" +
    "  <input name=\"dateShimNativePicker\" type=\"date\" placeholder=\"mm/dd/yyyy\" data-ng-model=\"clean.text\"/>" +
    "</div>" +
    "<div data-ng-show=\"!pickerSupported\">" +
    "  <input name=\"dateShimTextOnly\" type=\"text\" placeholder=\"mm/dd/yyyy\" data-ng-model=\"unclean.text\"/>" +
    "</div>");
}]);
angular.module('partials', ['directives/dateshim/dateshim.html']);
