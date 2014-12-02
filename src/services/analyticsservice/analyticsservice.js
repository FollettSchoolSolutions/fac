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