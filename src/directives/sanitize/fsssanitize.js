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