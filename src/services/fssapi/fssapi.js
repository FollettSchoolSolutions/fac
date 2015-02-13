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
  angular.module('fss.services.fssapi', [])

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