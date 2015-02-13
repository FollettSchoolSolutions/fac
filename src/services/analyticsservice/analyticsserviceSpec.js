'use strict';

describe('analytics suite', function () {

  var webPropertyID = 'UA-03151989-11';

  /**
   * This describe is for the usual case, that we initialized ga properly
   */
  describe('Analytics with a valid google analytics object', function () {
    var fakeGA, providerOverride, AnalyticsServiceProvider, fakeWindow = {}, AnalyticsService;

    beforeEach(function () {
      fakeGA = jasmine.createSpy('fakeGA');
      fakeWindow.location = {hash: '#/login'};

      providerOverride = function ($provide, _AnalyticsServiceProvider_) {
        $provide.value('$window', fakeWindow);
        AnalyticsServiceProvider = _AnalyticsServiceProvider_;
        AnalyticsServiceProvider.setGA(fakeGA);
        AnalyticsServiceProvider.enableGA(webPropertyID, {'cookieDomain': 'none'});
      };
      module('fss.services.analytics', providerOverride);
      inject(function (_AnalyticsService_) {
        AnalyticsService = _AnalyticsService_;
      });
    });

    /**
     * One off test that verifies we are initializing ga upon module initialization.
     */
    describe('Analytics module initialization', function () {
      it('should initialize ga with the proper key for development', function () {
        expect(fakeGA).toHaveBeenCalledWith('create', 'UA-03151989-11', {'cookieDomain': 'none'});
      });
    });

    /**
     * These tests are for testing that we actually pass the correct info to ga.  They reset
     * the ga object prior to each test so we don't see the initialization calls that are made
     * when as a result of the service being instantiated.
     */
    describe('Analytics tracking', function () {

      it('should register page views correctly', function () {
        AnalyticsService.trackPageView('The Login Page');
        expect(fakeGA).toHaveBeenCalledWith('send', {hitType: 'pageview', 'page': '#/login', 'title': 'The Login Page'});
      });

      it('should register page views correctly when no hash', function () {
        fakeWindow.location.hash = '';
        AnalyticsService.trackPageView('The Login Page');

        expect(fakeGA).toHaveBeenCalledWith('send', {hitType: 'pageview', 'page': '', 'title': 'The Login Page'});
      });

      it('should pass events on to the ga with the appropriate even tracking parameters', function () {
        var value = 4;
        AnalyticsService.trackEvent('The category of action', 'The action name', 'The label', value);

        expect(fakeGA).toHaveBeenCalledWith('send', 'event', 'The category of action', 'The action name', 'The label', value);
      });
    });
  });


  /**
   * This describe is only for the case when ga is undefined...
   */
  describe('Enabling Google Analytics with invalid/unavailable google analytics object', function () {
    var providerOverride, AnalyticsService;

    beforeEach(function () {
      providerOverride = function ($provide, AnalyticsServiceProvider) {
        AnalyticsServiceProvider.setGA(undefined);
      };
      module('fss.services.analytics', providerOverride);
      inject(function (_AnalyticsService_) {
        AnalyticsService = _AnalyticsService_;
      });
    });

    it('track page view should not blow up when ga is not enabled', function () {
      AnalyticsService.trackPageView('Some page');
    });

    it('track event should not blow up when ga is not enabled', function () {
      AnalyticsService.trackEvent('My category', 'My action name', 'My Label');
    });

  });

  /**
   * This describe is only for the case when ga is undefined...
   */
  describe('Analytics without enabling Google Analytics', function () {
    var AnalyticsService;

    beforeEach(function () {
      module('fss.services.analytics');

      inject(function (_AnalyticsService_) {
        AnalyticsService = _AnalyticsService_;
      });
    });

    it('track page view should not blow up when ga is not enabled', function () {
      AnalyticsService.trackPageView('Some page');
    });

    it('track event should not blow up when ga is not enabled', function () {
      AnalyticsService.trackEvent('My category', 'My action name', 'My Label');
    });

  });
});
