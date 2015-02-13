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

(function (angular) {
  'use strict';

  angular.module('directives.dateinput', ['ngMoment'])

    .directive('fssDateInput', ['$moment', '$window', function ($moment, $window) {
      return {
        require:'ngModel',
        restrict:'A',
        controller: angular.noop,
        link: function ($scope, element, attrs, modelCtrl) {
          var USER_FRIENDLY_FORMAT, USER_FRIENDLY_PARSING_FORMAT, ISO_FORMAT, canUseDatePicker;
          USER_FRIENDLY_FORMAT = 'MM/DD/YYYY';
          USER_FRIENDLY_PARSING_FORMAT = 'M/D/YYYY';
          ISO_FORMAT = 'YYYY-MM-DD';
          canUseDatePicker = $window.Modernizr.inputtypes.date;

          if (canUseDatePicker) {
            attrs.$set('type', 'date');
          } else {
            attrs.$set('type', 'text');
          }

          function formatDate(modelValue) {
            var dateString = '';

            if (modelValue) {
              if (canUseDatePicker) {
                dateString = $moment(modelValue).format(ISO_FORMAT);
              } else {
                dateString = $moment(modelValue).format(USER_FRIENDLY_FORMAT);
              }
            }
            return dateString;
          }

          function parseDate(viewValue) {
            var moment = null, modelValue = null, isValid = true, parseStrict = true;
            if (viewValue) {
              if (canUseDatePicker) {
                moment = $moment(viewValue, ISO_FORMAT, parseStrict);
              } else {
                moment = $moment(viewValue, USER_FRIENDLY_PARSING_FORMAT, parseStrict);
              }
              isValid = moment.isValid();
              if (isValid) {
                modelValue = moment.toDate();
              }
            }
            modelCtrl.$setValidity('invalidDate', isValid);
            return modelValue;
          }

          modelCtrl.$formatters.unshift(formatDate);
          modelCtrl.$parsers.unshift(parseDate);
        }
      };
    }])

    .directive('fssTodayOrLater', ['$moment', function ($moment) {
      return {
        restrict: 'A',
        require: ['ngModel', 'fssDateInput'],
        link: function ($scope, element, attrs, ctrls) {
          var modelCtrl = ctrls[0];
          function isDateInPast(date) {
            var isInPast = false, userMoment, currentMoment;
            if (date) {
              userMoment = $moment(date).startOf('day');
              if (userMoment.isValid()) {
                currentMoment = $moment().startOf('day');
                //Determine the difference in days between the user's expiration date and the current date
                if (userMoment.diff(currentMoment, 'days') < 0) {
                  isInPast = true;
                }
              }
            }
            return isInPast;
          }
          function validate(modelValue) {
            var isValid = !isDateInPast(modelValue);
            modelCtrl.$setValidity('dateInPast', isValid);
          }
          $scope.$watch(attrs.ngModel, validate);
        }
      };
    }])

    .directive('fssEndOfDay', ['$moment', function ($moment) {
      return {
        restrict: 'A',
        require: ['ngModel', 'fssDateInput'],
        link: function ($scope, element, attrs, ctrls) {
          var modelCtrl = ctrls[0];
          function parseDate(date) {
            if (date) {
              //Set to last second of day in the current time zone.
              date = $moment(date).endOf('day').toDate();
            }
            return date;
          }
          modelCtrl.$parsers.push(parseDate);
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
    angular.module('directives.dateshim', ['fss.services.datetime'])
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
                    scope.$watch('unclean.text', function (newVal) {
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
                    scope.$watch('clean.text', function (newVal) {
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

(function (angular) {
  'use strict';

  var DEFAULT_DELAY = 1000;

  angular.module('directives.delayedchange', [])

    // Directive that waits until changes stop for a specified time interval
    // before executing the expression.
    .directive('fssDelayedChange', ['$timeout', '$parse', function ($timeout, $parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {
          var promise, delay, onDelayedChange;
          delay = parseInt(attrs.delay, 10) || DEFAULT_DELAY;
          onDelayedChange = $parse(attrs.fssDelayedChange);
          ctrl.$viewChangeListeners.push(function () {
            $timeout.cancel(promise);
            promise = $timeout(function () {
              onDelayedChange($scope);
            }, delay);
          });
        }
      };
    }]);
}(angular));
(function (angular) {

  'use strict';

  angular.module('directives.focus', [])

    .directive('fssFocus', ['$timeout', function($timeout) {
      return {
        scope : {
          trigger : '@fssFocus'
        },
        link : function(scope, element) {
          scope.$watch('trigger', function(value) {
            if (value === 'true') {
              $timeout(function() {
                element[0].focus();
              });
            }
          });
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

    angular.module('directives.hidekeyboardonsubmit', [])
        .directive('fssHideKeyboardOnSubmit', ['$window', function ($window) {
            return function (scope, element) {
                element.bind('submit', function () {
                    $window.document.activeElement.blur();
                });
            };
        }]);
}());

(function (angular) {

  'use strict';

  angular.module('directives.highlightonclick', [])

    .directive('fssHighlightOnClick', [function () {
      return {
        link: function ($scope, element) {
          element.bind('click', function () {
            element[0].setSelectionRange(0, 999);
          });
        }
      };
    }]);

}(angular));
(function (angular) {

  'use strict';

  angular.module('directives.loading', [])

    .directive('fssLoading', [function () {
      return {
        restrict: 'A',
        replace: false,
        scope: { text: '@' },
        template: '{{ text }} <span class="dot-loading">' +
                  '  <span class="dot dot_1"></span>' +
                  '  <span class="dot dot_2"></span>' +
                  '  <span class="dot dot_3"></span>' +
                  '</span>'
      };
    }]);

}(angular));
/*
* FSS Angular component library
* Copyright 2013, Follett School Solutions, Inc.
*Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/* jshint ignore:start */

(function () {
	// 'use strict';

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

	function makeMap(str) {
	  var obj = {}, items = str.split(','), i;
	  for (i = 0; i < items.length; i++) {obj[items[i]] = true;}
	  return obj;
	}

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

/* jshint ignore:end */
(function (angular) {

  'use strict';

  angular.module('directives.scrollto', [])

    .directive('fssScrollTo', ['$window', function ($window) {
      return {
        restrict: 'A',
        scope: { scrollOn: '=scrollOn', condition: '=scrollIf' },
        link: function ($scope, $element) {
          $scope.$watch(function whenScrollOnAndConditionIsTrue() {
            return $scope.scrollOn && $scope.condition;
          }, function scrollToElementIfTrue(value) {
            if (value) {
              var yPositionOfElement = $element.position().top;
              $window.scrollTo(0, yPositionOfElement);
            }
          });
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

(function () {
  'use strict';

  angular.module('services.analytics', [])

    .provider('AnalyticsService', function () {
      var gaToUse;
      if (typeof(ga) !== 'undefined') {
        gaToUse = ga;
      }

      this.setGA = function (gaOverride) {
        gaToUse = gaOverride;
      };

      this.enableGA = function (webPropertyID, gaOptions) {
        if (typeof(gaToUse) !== 'undefined') {
          gaToUse('create', webPropertyID, gaOptions);
        }
      };

      this.$get = ['$window', function ($window) {
        var service = {};

        /**
         * Logs a page view to the google analytics service
         * @param title
         *
         */
        service.trackPageView = function (title) {
          var pageURL = $window.location.hash;

          if (typeof(gaToUse) !== 'undefined') {
            gaToUse('send', {
              'hitType': 'pageview',
              'page': pageURL,
              'title': title
            });
          }
        };

        /**
         * Tracks an event occurrence with ga
         * @param category string of event category
         * @param action string of event action
         * @param label string of event label
         * @param value number of event value
         */
        service.trackEvent = function (category, action, label, value) {
          if (typeof(gaToUse) !== 'undefined') {
            gaToUse('send', 'event', category, action, label, value);
          }
        };

        return service;
      }];

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

(function (angular) {
  'use strict';

  /**
   * The `fssApi` service is the declarative REST API client for
   * communicating with the Assessments server.
   *
   * ## How to Use It
   *
   * ### Setting It Up (`fssApiProvider`)
   *
   * In your module's `config()`, inject the `fssApiProvider` and call the `.resource(name, config)` method.
   *
   * **Example Code**
   *
   * ```
   * .config(['fssApiProvider', function (fssApiProvider) {
   *   fssApiProvider
   *
   *     // this will create a "UserResource" resource
   *     .resource('UserResource', {
   *
   *       // this will be the base path
   *       'path': '/users/:id',
   *
   *       // define your endpoints here
   *       'endpoints': {
   *
   *         // this will create a 'get()' method on UserResource
   *         'get': {
   *
   *           // required - 'GET', 'POST', 'UPDATE', 'DELETE'
   *           'method': 'GET',
   *
   *           // optional - custom JS object
   *           'produced': 'User',
   *
   *           // optional - used with 'produced' to say if the models should be put into an array
   *           'producesArray': true
   *
   *           // optional - parameters
   *           //
   *           // ':' for route param
   *           // '?' for query param
   *           // no prefix for body (will use `application/json` as Content-Type)
   *           'parameters': [':id', '?foo']
   *         },
   *
   *         // create an 'update()' method
   *         'update': {
   *
   *           // use the 'POST' HTTP method
   *           'method': 'POST',
   *
   *            // here we're not using a prefix.  this will send the POST request with
   *            // whatever object `newUser` is to the server as a json object
   *           'parameters': ['newUser']
   *         }
   *       }
   *     });
   * }])
   * ```
   *
   * ### Using the Resource (`fssApi`)
   *
   * Once you've set up the API, you can inject it to your controller, factory, what have you.
   *
   * **Example code**
   *
   * ```
   * .controller('MyController', ['fssApi', function (fssApi) {
   *
   *   // this will make a GET request to /users/123?foo=bar
   *   fssApi.UserResource.get('123', 'bar').then(function (result) {
   *     // result will be a `User` object
   *     $scope.user = result;
   *
   *     $scope.user.name = 'Joseph';
   *   });
   *
   *   // this will make POST request to /users/,
   *   // passing back the user object we got from `.get()`
   *   fssApi.UserResource.update($scope.user);
   * }])
   * ```
   *
   * @module fssApi
   */
  angular.module('services.fssapi', [])

    /**
     * Provider for `fssApi`.
     *
     * Use this in your module's `config()` method.
     *
     * @class fssApiProvider
     */
    .provider('fssApi', function () {

      var fssApi, apiConfig;

      fssApi = {};
      apiConfig = {};

      /**
       * Sets up a resource
       *
       * @method resource
       *
       * @param  {String} resourceName
       *
       *         The name of the resource
       *
       * @param  {Object} [theResource] The configuration of the resource
       *
       *    @param {String}  theResource.path                       the URL to use
       *    @param {Object}  theResource.endpoints                  the endpoints available to this resource
       *    @param {Object}  theResource.endpoints.x                the action that gets translated into a method on the resource
       *    @param {String}  theResource.endpoints.x.method         type of HTTP method (GET/POST/UPDATE/DELETE)
       *    @param {String}  theResource.endpoints.x.produced       the name of model to produce
       *    @param {Boolean} theResource.endpoints.x.produceArray   true if this action produces an array of the produced model.
       *                                                            Only applicable to endpoints that specify a "produced" model
       *    @param {Array}   theResource.endpoints.x.parameters     Dynamic parameters for the request. These can be the request
       *                                                            body, path parameters, or query parameters.
       *
       *                                                            - Path parameters should be prefixed with ":"
       *                                                            - Query parameters should be prefixed with "?"
       *                                                            - The request payload has no prefix. There should only be
       *                                                            at most one request payload parameter.
       */
      this.resource = function resource(name, resourceConfig) {
        apiConfig[name] = resourceConfig;
        return this;
      };

      /**
       * Gets the fssApi for dependency injection.
       *
       * @param  {FssApiResource} FssApiResource
       * @return {Object} the fssApi
       */
      this.$get = ['FssApiResource', function $get(FssApiResource) {

        function FssApi(apiConfig) {
          angular.forEach(apiConfig, function (resourceConfig, resourceName) {
            this[resourceName] = new FssApiResource(resourceConfig.path, resourceConfig.endpoints);
          }, this);
        }

        return new FssApi(apiConfig);
      }];
    })

    /**
     * A REST API resource. The resource specifies a path and its endpoints which can then
     * be accessed as methods on the resource.
     *
     * @class FssApiResource
     */
    .factory('FssApiResource', ['$injector', '$http', 'FssApiEndpointHelper', function ($injector, $http, FssApiEndpointHelper) {

      /**
       * Constructor for a FssApiResource.
       *
       * @constructor
       * @param {String} rootPath
       * @param {Object} endpoints
       */
      function FssApiResource(rootPath, endpoints) {
        angular.forEach(endpoints, function (endpoint, action) {
          var ProducedModelType, produced = endpoint.produced;

          if (produced && $injector.has(produced)) {
            ProducedModelType = $injector.get(produced);
          }

          this[action] = function () {
            var endpointHelper = new FssApiEndpointHelper(
              rootPath,
              endpoint.path,
              endpoint.method,
              endpoint.parameters,
              arguments);
            return $http(endpointHelper.getHttpConfig()).then(function (response) {
              var result;
              if (ProducedModelType) {
                if (endpoint.produceArray) {
                  result = [];
                  angular.forEach(response.data, function (data) {
                    result.push(new ProducedModelType(data));
                  });
                } else {
                  result = new ProducedModelType(response.data);
                }
              } else {
                result = response.data;
              }
              return result;
            });
          };
        }, this);
      }

      return FssApiResource;
    }])

    /**
     * Helper class for resolving the http configuration for actions on a resource.
     *
     * @class FssApiEndpointHelper
     */
    .factory('FssApiEndpointHelper', [function () {

      var PATH_PARAM_PREFIX, QUERY_PARAM_PREFIX;

      PATH_PARAM_PREFIX = ':';
      QUERY_PARAM_PREFIX = '?';

      /**
       * Constructor for a FssApiEndpointHelper.
       * @param {String} rootPath the root path
       * @param {String} additionalPath any additional path to be appended to the root path
       * @param {String} httpMethod GET, POST, UPDATE, or DELETE
       * @param {Array} configParameters the parameters specified for the endpoint in the config
       * @param {arguments} actionArguments the actual arguments used when calling the action method
       */
      function FssApiEndpointHelper(rootPath, additionalPath, httpMethod, configParameters, actionArguments) {

        configParameters = configParameters || [];

        /**
         * Gets the resolved url based on the configuration and arguments for the action.
         *
         * @method getUrl
         * @return {String} the resolved url
         */
        this.getUrl = function getUrl() {
          var url;

          function isValidPathParam(pathParam) {
            return typeof pathParam === 'string' ||
                   typeof pathParam === 'number' ||
                   typeof pathParam === 'boolean';
          }
          function appendPath(rootPath, additionalPath) {
            var url = rootPath.replace(new RegExp('/$', 'g'), '');
            if (additionalPath) {
              if (additionalPath.charAt(0) !== '/') {
                url += '/';
              }
              url += additionalPath;
            }
            return url;
          }
          function resolvePathParams(url) {
            var param, arg, i, len;
            for (i = 0, len = configParameters.length; i < len; i++) {
              param = configParameters[i];
              if (param.charAt(0) === PATH_PARAM_PREFIX) {
                arg = actionArguments[i];
                if (!isValidPathParam(arg)) {
                  arg = '';
                }
                arg = encodeURIComponent(arg);
                url = url.replace(new RegExp(param, 'g'), arg);
              }
            }
            return url;
          }

          url = appendPath(rootPath, additionalPath);
          url = resolvePathParams(url);

          // Gets rid of unresolved path parameters
          url = url.replace(new RegExp(PATH_PARAM_PREFIX + '.*?/','g'), '');
          // Gets rid of a trailing unresolved path parameter
          url = url.replace(new RegExp(PATH_PARAM_PREFIX + '.*?$','g'), '');
          // Gets rid of trailing slashes
          url = url.replace(new RegExp('/$','g'), '');
          return url;
        };

        /**
         * Gets the resolved body for the request based on the configuration and arguments for the action.
         *
         * @method getPayload
         * @return {Object}
         */
        this.getPayload = function getPayload() {
          var payload, param, i, len;
          for (i = 0, len = configParameters.length; i < len; i++) {
            param = configParameters[i];
            if (param.charAt(0) !== PATH_PARAM_PREFIX && param.charAt(0) !== QUERY_PARAM_PREFIX) {
              payload = actionArguments[i];
              break;
            }
          }
          return payload;
        };

        /**
         * Gets the resolved query parameters for the request based on the configuration and arguments for the action.
         *
         * @method getQueryParams
         * @return {Object}
         */
        this.getQueryParams = function getQueryParams() {
          var queryParams = {}, param, i, len;
          for (i = 0, len = configParameters.length; i < len; i++) {
            param = configParameters[i];
            if (param.charAt(0) === QUERY_PARAM_PREFIX) {
              if (actionArguments[i] !== undefined) {
                queryParams[param.substring(1)] = actionArguments[i];
              }
            }
          }
          return queryParams;
        };

        /**
         * Gets the http config used for the call to angular's $http service.
         *
         * @method getHttpConfig
         * @return {Object}
         */
        this.getHttpConfig = function getHttpConfig() {
          var httpConfig = {};
          httpConfig.method = httpMethod;
          httpConfig.url = this.getUrl();
          httpConfig.params = this.getQueryParams();
          httpConfig.data = this.getPayload();
          return httpConfig;
        };
      }

      return FssApiEndpointHelper;
    }]);

}(angular));
angular.module('fss.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('directives/dateshim/dateshim.html',
    "<div data-ng-show=\"pickerSupported\"> <input name=\"dateShimNativePicker\" type=\"date\" placeholder=\"mm/dd/yyyy\" data-ng-model=\"clean.text\"> </div> <div data-ng-show=\"!pickerSupported\"> <input name=\"dateShimTextOnly\" type=\"text\" placeholder=\"mm/dd/yyyy\" data-ng-model=\"unclean.text\"> </div>"
  );

}]);
