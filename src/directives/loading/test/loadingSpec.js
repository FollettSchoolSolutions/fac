'use strict';

describe('fss.directives.fssloading', function () {

  var rootScope, compile;

  beforeEach(function () {
    module('fss.directives.loading', 'templates');
    inject(function($compile, $rootScope) {
      rootScope = $rootScope.$new();
      compile = $compile;
    });
  });

  describe('in general', function () {

    var compiledHTML;

    beforeEach(function () {
      compiledHTML = compile('<h2 data-fss-loading></h2>')(rootScope);
      rootScope.$digest();
    });

    it('should have three dots', function () {
      var theDots = compiledHTML.find('.dot-loading');
      expect(theDots.children().length).toBe(3);
      expect(theDots.children(0).hasClass('dot')).toBeTruthy();
      expect(theDots.children(0).hasClass('dot_1')).toBeTruthy();
      expect(theDots.children(1).hasClass('dot')).toBeTruthy();
      expect(theDots.children(1).hasClass('dot_2')).toBeTruthy();
      expect(theDots.children(2).hasClass('dot')).toBeTruthy();
      expect(theDots.children(2).hasClass('dot_3')).toBeTruthy();
    });

  });

  describe('with the "text" attribute', function () {

    var compiledHTML;

    beforeEach(function () {
      compiledHTML = compile('<h2 data-fss-loading data-text="Loading"></h2>')(rootScope);
      rootScope.$digest();
    });

    it('should have the text in the parent node', function () {
      expect(compiledHTML.text().trim()).toEqual('Loading');
    });

  });

});