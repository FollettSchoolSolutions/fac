'use strict';

describe('fss.directives.scrollto', function () {

  var $window, $compile, $rootScope, $scope;

  beforeEach(function () {
    $window = jasmine.createSpyObj('$window', ['scrollTo']);
    module('fss.directives.scrollto', function ($provide) {
      $provide.value('$window', $window);
    });

    inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
    });

  });

  it('should scroll to the element if "scroll-on" is true and if "scroll-if" is true', function () {
    $scope.scrollOn = false;
    $scope.condition = false;

    var directiveHTML = '<div data-fss-scroll-to data-scroll-on="scrollOn" data-scroll-if="condition"></div>';
    $compile(directiveHTML)($scope);
    $scope.$digest();

    expect($window.scrollTo).not.toHaveBeenCalled();

    $scope.scrollOn = true;
    $scope.$digest();
    expect($window.scrollTo).not.toHaveBeenCalled();

    $scope.condition = true;
    $scope.$digest();
    expect($window.scrollTo).toHaveBeenCalled();

  });

});