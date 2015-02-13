'use strict';

describe('fssApi', function () {

  var provide;

  // Create a test configuration of an api
  angular.module('testFssApi', ['fss.services.fssapi'])
    .config(function (fssApiProvider) {
      fssApiProvider
        .resource('ComicBooksResource', {
          path: '/rest/comics/:series',
          endpoints: {
            'getAll': {
              method: 'GET',
              parameters: ['?author', '?date'],
              produced: 'ComicBookModel',
              produceArray: true
            },
            'getOne': {
              method: 'GET',
              parameters: [':series'],
              produced: 'ComicBookModel'
            },
            'update': {
              method: 'PUT',
              parameters: ['comicBook']
            }
          }
        })

        .resource('AuthorsResource', {
          path: '/rest/authors/:id',
          endpoints: {
            'getAuthor': {
              method: 'GET',
              parameters: [':id']
            },
            'getBooks': {
              path: '/books',
              method: 'GET',
              parameters: [':id', '?superhero'],
              produced: 'ComicBookModel',
              produceArray: true
            }
          }
        });
    });

  beforeEach(module('testFssApi', function ($provide) {
    provide = $provide;
  }));

  describe('FssApiEndpointHelper', function () {
    var helper;

    function initHelper(path, additionalPath, httpMethod, configParameters, actionArguments) {
      inject(function (FssApiEndpointHelper) {
        helper = new FssApiEndpointHelper(path, additionalPath, httpMethod, configParameters, actionArguments);
      });
    }

    function getActionArguments() {
      return arguments;
    }

    describe('getQueryParams', function () {
      var configParameters, actionArguments, expected;

      it('should return an empty object when there are no config parameters', function () {

        configParameters = [];
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});

        configParameters = [];
        actionArguments = getActionArguments('stuff', 'things');
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});

        configParameters = undefined;
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});

        configParameters = null;
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});

        configParameters = '';
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});

        configParameters = [''];
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});

        configParameters = 'a string';
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});
      });

      it('should return an empty object when there are config parameters, but none are prefixed with ?', function () {

        configParameters = ['daffy', 'goofy'];
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});

        configParameters = [':mickey', ':mouse'];
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({});
      });

      it('should return an object with the parameter set as null when the action argument is null', function () {

        configParameters = ['?daffy'];
        actionArguments = getActionArguments(null);
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({
          daffy: null
        });
      });

      it('should remove properties for undefined action arguments', function () {

        configParameters = ['?daffy', '?stuff'];
        actionArguments = getActionArguments(5);
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getQueryParams()).toEqual({
          daffy: 5
        });
        expect(helper.getQueryParams().stuff).not.toBeDefined();
      });

      it('should create a query param for every configParameter prefixed with ?', function () {

        configParameters = ['?stuff', 'daffy', ':bar', '?thing'];
        actionArguments = getActionArguments('stuffValue', 'daffyValue', 'barValue', 'thingValue');
        initHelper(null, null, null, configParameters, actionArguments);

        expected = {
          stuff: 'stuffValue',
          thing: 'thingValue'
        };

        expect(helper.getQueryParams()).toEqual(expected);
      });
    });

    describe('getPayload', function () {
      var configParameters, actionArguments, expected;

      it('should return undefined if there are no parameters or every parameter is prefixed with either : or ?', function () {

        configParameters = [];
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();

        configParameters = [];
        actionArguments = getActionArguments('stuff', 'things');
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();

        configParameters = null;
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();

        configParameters = undefined;
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();

        configParameters = '';
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();

        configParameters = 'a string';
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();

        configParameters = [''];
        actionArguments = getActionArguments();
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();

        configParameters = ['?stuff', ':things'];
        actionArguments = getActionArguments('stuff', 'things');
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).not.toBeDefined();
      });

      it('should return the action argument that corresponds to the first config parameter with no : or ? prefix', function () {

        expected = {
          blue: 'barracudas',
          purple: 'parrots'
        };
        configParameters = ['payload'];
        actionArguments = getActionArguments(expected);
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).toEqual(expected);

        configParameters = ['?query', ':path', 'payload'];
        actionArguments = getActionArguments('query param value', 'path param value', expected);
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).toEqual(expected);

        configParameters = ['?query', ':path', 'payload'];
        actionArguments = getActionArguments('query param value', 'path param value', null);
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).toEqual(null);

        configParameters = ['?query', ':path', 'payload', 'unused param'];
        actionArguments = getActionArguments('query param value', 'path param value', expected, 'unused param value');
        initHelper(null, null, null, configParameters, actionArguments);
        expect(helper.getPayload()).toEqual(expected);
      });
    });

    describe('getUrl', function () {
      var rootPath, additionalPath, configParameters, actionArguments;

      it('should return the path when there is no additionalPath, path parameters, nor matching action argument to the path parameter', function () {

        rootPath = '/rest/teams/:id';
        additionalPath = undefined;

        configParameters = undefined;
        actionArguments = getActionArguments();
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams');

        configParameters = [];
        actionArguments = getActionArguments();
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams');

        configParameters = [];
        actionArguments = getActionArguments('stuff', 'things');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams');

        configParameters = [':id'];
        actionArguments = getActionArguments();
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams');

        configParameters = [':id'];
        actionArguments = getActionArguments(null);
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams');

        rootPath = 'rest/teams/:id';
        additionalPath = undefined;
        configParameters = undefined;
        actionArguments = getActionArguments();
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('rest/teams');
      });

      it('should replace all path parameters with the corresponding action arguments', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = undefined;

        configParameters = [':id'];
        actionArguments = getActionArguments('greenmonkeys');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/greenmonkeys');

        configParameters = ['?tokens', ':id'];
        actionArguments = getActionArguments(3, 'greenmonkeys');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/greenmonkeys');

        configParameters = ['?tokens', ':stuff', ':id'];
        actionArguments = getActionArguments(3, 'things', 'greenmonkeys');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/greenmonkeys');

        configParameters = ['?tokens', 'body', ':id', ':stuff'];
        actionArguments = getActionArguments(3, 'cool', 'greenmonkeys', 'things');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/greenmonkeys');
      });

      it('should url encode path parameters', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = undefined;

        configParameters = [':id'];
        actionArguments = getActionArguments('orange iguanas');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/orange%20iguanas');
      });

      it('should append the additionalPath to the path', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = '/roster';
        configParameters = [':id'];
        actionArguments = getActionArguments('silversnakes');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/silversnakes/roster');

        rootPath = '/rest/teams/:id/';
        additionalPath = '/roster';
        configParameters = [':id'];
        actionArguments = getActionArguments('silversnakes');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/silversnakes/roster');

        rootPath = '/rest/teams/:id';
        additionalPath = 'roster';
        configParameters = [':id'];
        actionArguments = getActionArguments('silversnakes');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/silversnakes/roster');

        rootPath = '/rest/teams/:id/';
        additionalPath = 'roster';
        configParameters = [':id'];
        actionArguments = getActionArguments('silversnakes');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/silversnakes/roster');
      });

      it('should remove any trailing slashes', function () {
        rootPath = '/rest/teams/:id/';
        additionalPath = undefined;
        configParameters = [':id'];
        actionArguments = getActionArguments('purpleparrots');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/purpleparrots');

        rootPath = '/rest/teams/:id/';
        additionalPath = '/roster/';
        configParameters = [':id'];
        actionArguments = getActionArguments('purpleparrots');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/purpleparrots/roster');
      });

      it('should resolve the path parameter with the empty string if the corresponding action argument is undefined', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = '/roster';

        configParameters = [':id'];
        actionArguments = getActionArguments(undefined);
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams//roster');
      });

      it('should resolve the path parameter with the empty string if the corresponding action argument is null', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = '/roster';

        configParameters = [':id'];
        actionArguments = getActionArguments(null);
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams//roster');
      });

      it('should resolve the path parameter with the empty string if the corresponding action argument is an object', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = '/roster';

        configParameters = [':id'];
        actionArguments = getActionArguments({});
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams//roster');
      });

      it('should resolve the path parameter with the empty string if the corresponding action argument is a function', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = '/roster';

        configParameters = [':id'];
        actionArguments = getActionArguments(angular.noop);
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams//roster');
      });

      it('should resolve duplicate path parameters with their corresponding action argument', function () {
        rootPath = '/rest/teams/:id';
        additionalPath = '/roster/:id';

        configParameters = [':id'];
        actionArguments = getActionArguments('greenmonkeys');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/greenmonkeys/roster/greenmonkeys');

        rootPath = '/rest/teams/:id/roster/:id';
        additionalPath = undefined;

        configParameters = [':id'];
        actionArguments = getActionArguments('greenmonkeys');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/greenmonkeys/roster/greenmonkeys');
      });

      it('should resolve multiple path parameters with their corresponding action arguments', function () {
        rootPath = '/rest/teams/:team1Id';
        additionalPath = '/versus/:team2Id';

        configParameters = [':team1Id', ':team2Id'];
        actionArguments = getActionArguments('bluebarracudas', 'redjaguars');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/bluebarracudas/versus/redjaguars');

        rootPath = '/rest/teams/:team1Id/versus/:team2Id';
        additionalPath = undefined;

        configParameters = [':team1Id', ':team2Id'];
        actionArguments = getActionArguments('bluebarracudas', 'redjaguars');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/bluebarracudas/versus/redjaguars');

        rootPath = '/rest/teams/:team1Id';
        additionalPath = '/versus/:team2Id';

        configParameters = ['artifact', ':team1Id', '?points', ':team2Id'];
        actionArguments = getActionArguments('golden sombrero', 'bluebarracudas', 5, 'redjaguars');
        initHelper(rootPath, additionalPath, null, configParameters, actionArguments);
        expect(helper.getUrl()).toBe('/rest/teams/bluebarracudas/versus/redjaguars');
      });
    });

    describe('getHttpConfig', function () {
      var rootPath, additionalPath, method, configParameters, actionArguments;

      it('should create an http config based on the configuration', function () {
        var cereal;

        rootPath = '/rest/cereal/:brand';
        additionalPath = undefined;
        method = 'GET';
        configParameters = ['?chocolate', '?healthy'];
        actionArguments = getActionArguments(true, false);
        initHelper(rootPath, additionalPath, method, configParameters, actionArguments);
        expect(helper.getHttpConfig()).toEqual({
          method: 'GET',
          url: '/rest/cereal',
          params: {
            chocolate: true,
            healthy: false
          },
          data: undefined
        });

        cereal = {
          delicious: true,
          crunchy: true,
          fruity: 'somewhat'
        };
        rootPath = '/rest/cereal/:brand';
        additionalPath = undefined;
        method = 'POST';
        configParameters = ['cereal', ':brand'];
        actionArguments = getActionArguments(cereal, 'Kellogg\'s');
        initHelper(rootPath, additionalPath, method, configParameters, actionArguments);
        expect(helper.getHttpConfig()).toEqual({
          method: 'POST',
          url: '/rest/cereal/Kellogg\'s',
          params: {},
          data: cereal
        });
      });
    });
  });

  describe('FssApiResource', function () {
    var ApiResource, httpBackend;

    function CerealModel(rawCerealData) {
      angular.extend(this, rawCerealData);

      this.getCaloriesPercentDailyValue = function getCaloriesPercentDailyValue(total) {
        return total >= 0 ? this.calories / total : 0;
      };
    }

    beforeEach(function () {
      inject(function (FssApiResource, $httpBackend) {
        ApiResource = FssApiResource;
        httpBackend = $httpBackend;
      });
      provide.value('CerealModel', CerealModel);
    });

    it('should decorate the resource with action methods based on the endpoints', function () {
      var apiResource, rootPath, endpoints;

      rootPath = '/rest/cereal/:brand';
      endpoints = {
        'getCereal': {},
        'getAllCereals': {},
        'updateCereal': {}
      };
      apiResource = new ApiResource(rootPath, endpoints);
      expect(typeof apiResource.getCereal).toBe('function');
      expect(typeof apiResource.getAllCereals).toBe('function');
      expect(typeof apiResource.updateCereal).toBe('function');
    });

    it('should have an action method that returns the response data if "produced" is not set', function () {
      var apiResource, rootPath, endpoints, result;

      rootPath = '/rest/cereal/:brand';
      endpoints = {
        'getCereal': {
          method: 'GET',
          parameters: [':brand']
        }
      };
      apiResource = new ApiResource(rootPath, endpoints);

      httpBackend.expectGET('/rest/cereal/kelloggs').respond(200, {
        calories: 240,
        carbohydrates: '25g'
      });
      apiResource.getCereal('kelloggs').then(function (data) {
        result = data;
      });
      httpBackend.flush();
      expect(result).toEqual({
        calories: 240,
        carbohydrates: '25g'
      });
    });

    it('should have an action method that returns the produced model type if "produced" is set', function () {
      var apiResource, rootPath, endpoints, result;

      rootPath = '/rest/cereal/:brand';
      endpoints = {
        'getCereal': {
          method: 'GET',
          parameters: [':brand'],
          produced: 'CerealModel'
        }
      };
      apiResource = new ApiResource(rootPath, endpoints);

      httpBackend.expectGET('/rest/cereal/special-k').respond(200, {
        calories: 300
      });
      apiResource.getCereal('special-k').then(function (data) {
        result = data;
      });
      httpBackend.flush();
      expect(result.constructor.name).toBe('CerealModel');

      // since result is a CerealModel type, we call methods from its prototype, too
      expect(result.getCaloriesPercentDailyValue(2000)).toBe(0.15);

    });

    it('should have an action method that returns the response data if the produced model is not found', function () {
      var apiResource, rootPath, endpoints, result;

      rootPath = '/rest/cereal/:brand';
      endpoints = {
        'getCereal': {
          method: 'GET',
          parameters: [':brand'],
          produced: 'AClearlyMisnamedFactoryModelName'
        }
      };
      apiResource = new ApiResource(rootPath, endpoints);
      httpBackend.expectGET('/rest/cereal/generalmills').respond(200, {
        calories: 300
      });
      apiResource.getCereal('generalmills').then(function (data) {
        result = data;
      });
      httpBackend.flush();
      expect(result).toEqual({
        calories: 300
      });
    });

    it('should have an action method that returns an array of produced models if "produced" is set and "produceArray" is true', function () {
      var apiResource, rootPath, endpoints, result, responseData;

      rootPath = '/rest/cereal/:brand';
      endpoints = {
        'getAllCereals': {
          method: 'GET',
          produced: 'CerealModel',
          produceArray: true
        }
      };
      apiResource = new ApiResource(rootPath, endpoints);

      responseData = [
        {
          name: 'Frosted Flakes',
          calories: 250
        }, {
          name: 'Rice Krispies',
          calories: 200
        }, {
          name: 'Lucky Charms',
          calories: 300
        }
      ];

      httpBackend.expectGET('/rest/cereal').respond(200, responseData);
      apiResource.getAllCereals().then(function (data) {
        result = data;
      });
      httpBackend.flush();
      expect(result instanceof Array).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0].constructor.name).toBe('CerealModel');
      expect(result[1].constructor.name).toBe('CerealModel');
      expect(result[2].constructor.name).toBe('CerealModel');
      expect(result[0].name).toBe('Frosted Flakes');
      expect(result[1].name).toBe('Rice Krispies');
      expect(result[2].name).toBe('Lucky Charms');
    });

  });

  describe('fssApiProvider', function () {
    function ComicBookModel(rawComicBookData) {
      angular.extend(this, rawComicBookData);
    }

    beforeEach(function () {


      provide.value('ComicBookModel', ComicBookModel);
    });

    it('should build the api based on resources registered in angular configs', function () {
      var api;
      inject(function (fssApi) {
        api = fssApi;
      });

      expect(api.ComicBooksResource).toBeDefined();
      expect(api.AuthorsResource).toBeDefined();
      expect(typeof api.ComicBooksResource.getAll).toBe('function');
      expect(typeof api.ComicBooksResource.getOne).toBe('function');
      expect(typeof api.ComicBooksResource.update).toBe('function');
      expect(typeof api.AuthorsResource.getAuthor).toBe('function');
      expect(typeof api.AuthorsResource.getBooks).toBe('function');
    });
  });
});
