(function () {
  'use strict';

  describe('directives.delayedchange', function () {

    describe('fssDelayedChange', function () {
      var $timeout, $compile, $rootScope;

      beforeEach(function () {
        module('directives.delayedchange');
        inject(function (_$timeout_, _$compile_, _$rootScope_) {
          $timeout = _$timeout_;
          $compile = _$compile_;
          $rootScope = _$rootScope_;
        });
        $timeout.verifyNoPendingTasks();
      });

      it('should execute the expression after the timeout', function () {
        var rawHTML, compiledHTML, scope;
        scope = $rootScope.$new();

        scope.myModel = 'hello';
        scope.mySpy = jasmine.createSpy('mySpy');
        rawHTML = '<input type="text" ng-model="myModel" fss-delayed-change="mySpy(myModel)">';

        compiledHTML = $compile(rawHTML)(scope);
        expect(scope.mySpy).not.toHaveBeenCalled();

        compiledHTML.val('hello!');
        compiledHTML.trigger('change');
        expect(scope.mySpy).not.toHaveBeenCalled();

        $timeout.flush();
        expect(scope.mySpy).toHaveBeenCalledWith('hello!');
      });

      it('should only execute the expression once if changes happen within the delay time', function () {
        var rawHTML, compiledHTML, scope;
        scope = $rootScope.$new();

        scope.myModel = 'hello';
        scope.mySpy = jasmine.createSpy('mySpy');
        rawHTML = '<input type="text" ng-model="myModel" fss-delayed-change="mySpy()">';

        compiledHTML = $compile(rawHTML)(scope);
        expect(scope.mySpy).not.toHaveBeenCalled();

        compiledHTML.val('hello!');
        compiledHTML.trigger('change');
        compiledHTML.val('hello!!');
        compiledHTML.trigger('change');
        compiledHTML.val('hello!!!');
        compiledHTML.trigger('change');
        compiledHTML.val('hello!!!!');
        compiledHTML.trigger('change');
        compiledHTML.val('hello!!!!!');
        compiledHTML.trigger('change');

        expect(scope.mySpy).not.toHaveBeenCalled();
        $timeout.flush();
        expect(scope.mySpy.calls.count()).toBe(1);

        compiledHTML.val('hello!!!!');
        compiledHTML.trigger('change');
        compiledHTML.val('hello!!!');
        compiledHTML.trigger('change');
        compiledHTML.val('hello!!');
        compiledHTML.trigger('change');
        compiledHTML.val('hello!');
        compiledHTML.trigger('change');

        $timeout.flush();
        expect(scope.mySpy.calls.count()).toBe(2);
      });

      it('should default to a 1000 ms delay', function () {
        var rawHTML, compiledHTML, scope;
        scope = $rootScope.$new();

        scope.myModel = 'hello';
        scope.mySpy = jasmine.createSpy('mySpy');
        rawHTML = '<input type="text" ng-model="myModel" fss-delayed-change="mySpy()">';

        compiledHTML = $compile(rawHTML)(scope);
        expect(scope.mySpy).not.toHaveBeenCalled();

        compiledHTML.trigger('change');
        expect(scope.mySpy).not.toHaveBeenCalled();

        $timeout.flush(999);
        expect(scope.mySpy).not.toHaveBeenCalled();
        $timeout.flush(1);
        expect(scope.mySpy).toHaveBeenCalled();

        $timeout.verifyNoPendingTasks();
      });

      it('should set the delay when specified as an attribute', function () {
        var rawHTML, compiledHTML, scope;
        scope = $rootScope.$new();

        scope.myModel = 'hello';
        scope.mySpy = jasmine.createSpy('mySpy');
        rawHTML = '<input type="text" ng-model="myModel" fss-delayed-change="mySpy()" delay="700">';

        compiledHTML = $compile(rawHTML)(scope);
        expect(scope.mySpy).not.toHaveBeenCalled();

        compiledHTML.trigger('change');
        expect(scope.mySpy).not.toHaveBeenCalled();

        $timeout.flush(699);
        expect(scope.mySpy).not.toHaveBeenCalled();
        $timeout.flush(1);
        expect(scope.mySpy).toHaveBeenCalled();

        $timeout.verifyNoPendingTasks();
      });
    });
  });
}());