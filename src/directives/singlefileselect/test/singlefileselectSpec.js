'use strict';

describe('fssSingleFileSelect', function () {

  var $rootScope, $compile;

  function providerOverride($provide) {
    $provide.value('ngFileSelectDirective', angular.noop);
  }

  beforeEach(module('fss.directives.singlefileselect', providerOverride));

  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('onFileSelect', function () {

    it('should set the value of the model to the first element in the $files array', function () {
      var $scope = $rootScope.$new();
      var html = '<input name="myFile" type="file" fss-single-file-select ng-model="myFile">';
      $compile(html)($scope);

      expect($scope.myFile).toBeUndefined();

      var files = [{ name: 'cute-baby-turtle.jpg' }];
      $scope.onFileSelect(files);
      expect($scope.myFile).toEqual({ name: 'cute-baby-turtle.jpg' });
    });

    it('should dirty the form', function () {
      var $scope = $rootScope.$new();
      var html = '<form name="myForm"><input name="myFile" type="file" fss-single-file-select ng-model="myFile"></form>';
      $compile(html)($scope);

      expect($scope.myForm.$dirty).toBeFalsy();
      expect($scope.myForm.myFile.$dirty).toBeFalsy();
      expect($scope.myForm.$pristine).toBeTruthy();
      expect($scope.myForm.myFile.$pristine).toBeTruthy();

      var files = [{ name: 'cute-baby-turtle.jpg' }];
      $scope.onFileSelect(files);
      expect($scope.myForm.$dirty).toBeTruthy();
      expect($scope.myForm.myFile.$dirty).toBeTruthy();
      expect($scope.myForm.$pristine).toBeFalsy();
      expect($scope.myForm.myFile.$pristine).toBeFalsy();
    });

    it('should call the angular expression provided as the fss-single-file-select attribute', function () {
      var $scope = $rootScope.$new();
      $scope.mySpy = jasmine.createSpy('mySpy');
      $scope.someArg = 'cats';
      var html = '<input name="myFile" type="file" fss-single-file-select="mySpy(someArg)" ng-model="myFile">';
      $compile(html)($scope);

      expect($scope.mySpy).not.toHaveBeenCalled();

      $scope.onFileSelect([{ name: 'cute-baby-turtle.jpg' }]);
      expect($scope.mySpy).toHaveBeenCalledWith('cats');
    });

    it('should set the model before calling the fss-single-file-select function', function () {
      var $scope = $rootScope.$new(), result;
      $scope.mySpy = function () {
        result = $scope.myFile;
      };
      $scope.someArg = 'cats';
      var html = '<input name="myFile" type="file" fss-single-file-select="mySpy()" ng-model="myFile">';
      $compile(html)($scope);

      $scope.onFileSelect([{ name: 'cute-baby-turtle.jpg' }]);
      expect(result).toEqual({ name: 'cute-baby-turtle.jpg' });
    });
  });
});