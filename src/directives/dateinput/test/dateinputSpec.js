(function () {
  'use strict';

  describe('directives.dateinput', function () {

    var $compile, $rootScope, $window, $moment;

    beforeEach(function () {
      module('directives.dateinput');
      inject(function (_$compile_, _$rootScope_, _$window_, _$moment_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        $moment = _$moment_;
      });
    });

    describe('fssDateInput', function () {
      describe('when the date input type is supported', function () {
        beforeEach(function () {
          $window.Modernizr.inputtypes.date = true;
        });

        it('should set the input type to date', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = new Date(2050, 2, 15);
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          expect(compiledHTML.attr('type')).toBe('date');
        });

        it('should format the date in ISO format', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = new Date(2050, 2, 15);
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          expect(compiledHTML.val()).toBe('2050-03-15');
        });

        it('should parse user entry into a date', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = new Date(2050, 2, 15);
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          compiledHTML.val('3000-06-07');
          compiledHTML.trigger('change');

          expect($scope.myDate).toEqual(new Date(3000, 5, 7));
        });

        it('should have a blank value if the model is null', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = null;
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          expect(compiledHTML.val()).toBe('');
        });
      });

      describe('when the date input type is NOT supported', function () {
        beforeEach(function () {
          $window.Modernizr.inputtypes.date = false;
        });

        it('should set the input type to text', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = new Date(2050, 2, 15);
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          expect(compiledHTML.attr('type')).toBe('text');
        });

        it('should format the date in MM/DD/YYYY format', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = new Date(2050, 2, 15);
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          expect(compiledHTML.val()).toBe('03/15/2050');
        });

        it('should parse user entry into a date', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = new Date(2050, 2, 15);
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          compiledHTML.val('06/07/3000');
          compiledHTML.trigger('change');
          expect($scope.myDate).toEqual(new Date(3000, 5, 7));

          compiledHTML.val('06/07');
          compiledHTML.trigger('change');
          expect($scope.myDate).toBeNull();

          compiledHTML.val('6/7/3000');
          compiledHTML.trigger('change');
          expect($scope.myDate).toEqual(new Date(3000, 5, 7));

          compiledHTML.val('');
          compiledHTML.trigger('change');
          expect($scope.myDate).toBeNull();
        });

        it('should have a blank value if the model is null', function () {
          var rawHTML, compiledHTML, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = null;
          rawHTML = '<input ng-model="myDate" fss-date-input>';
          compiledHTML = $compile(rawHTML)($scope);
          $rootScope.$digest();

          expect(compiledHTML.val()).toBe('');
        });

        it('should set the invalidDate error', function () {
          var rawHTML, datePicker, $scope;
          $scope = $rootScope.$new();

          $scope.myDate = null;
          rawHTML =
            '<form name="myForm">' +
              '<input id="picker" name="myDate" ng-model="myDate" fss-date-input>' +
            '</form>';
          datePicker = $compile(rawHTML)($scope).find('#picker');
          $rootScope.$digest();

          expect($scope.myForm.myDate.$error.invalidDate).toBeFalsy();

          datePicker.val('1989');
          datePicker.trigger('change');
          expect($scope.myForm.myDate.$error.invalidDate).toBeTruthy();

          datePicker.val('03/1989');
          datePicker.trigger('change');
          expect($scope.myForm.myDate.$error.invalidDate).toBeTruthy();

          datePicker.val('03/15/89');
          datePicker.trigger('change');
          expect($scope.myForm.myDate.$error.invalidDate).toBeTruthy();

          datePicker.val('03/15/1989');
          datePicker.trigger('change');
          expect($scope.myForm.myDate.$error.invalidDate).toBeFalsy();

          datePicker.val('');
          datePicker.trigger('change');
          expect($scope.myForm.myDate.$error.invalidDate).toBeFalsy();
        });
      });
    });

    describe('fssTodayOrLater', function () {
      it('should set dateInPast to invalid when the date is in the past', function () {
        var rawHTML, $scope;
        $scope = $rootScope.$new();
        $scope.myDate = new Date(1989, 2, 15);
        rawHTML =
          '<form name="myForm">' +
          '  <input name="myDate" fss-date-input fss-today-or-later ng-model="myDate">' +
          '</form>';
        $compile(rawHTML)($scope);
        $rootScope.$digest();

        expect($scope.myForm.myDate.$error.dateInPast).toBe(true);

        $scope.myDate = new Date(4000, 1, 1);
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(false);

        $scope.myDate = new Date(1989, 2, 15);
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(true);

        $scope.myDate = new Date();
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(false);

        // yesterday
        $scope.myDate = new Date();
        $scope.myDate.setDate($scope.myDate.getDate() - 1);
        $scope.myDate.setSeconds($scope.myDate.getSeconds() + 1);
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(true);

        $scope.myDate = null;
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(false);

        $scope.myDate = undefined;
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(false);

        $scope.myDate = '';
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(false);

        $scope.myDate = '   ';
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(false);

        $scope.myDate = ' afd';
        $rootScope.$digest();
        expect($scope.myForm.myDate.$error.dateInPast).toBe(false);
      });
    });


    describe('fssEndOfDay', function () {
      beforeEach(function () {
        $window.Modernizr.inputtypes.date = false;
      });

      it('should set the date to the end of the day', function () {
        var rawHTML, compiledHTML, $scope, expDate;

        $scope = $rootScope.$new();

        $scope.myDate = null;
        rawHTML = '<input ng-model="myDate" fss-date-input fss-end-of-day>';
        compiledHTML = $compile(rawHTML)($scope);
        $rootScope.$digest();

        expect($scope.myDate).toEqual(null);

        expDate = $moment('3000-06-07').endOf('day').toDate();
        compiledHTML.val('06/07/3000');
        compiledHTML.trigger('change');
        expect($scope.myDate).toEqual(expDate);

        //we expect that this time is a local time
        expect(new Date(3000, 5, 7).getTimezoneOffset()).toEqual($scope.myDate.getTimezoneOffset());
      });
    });
  });
}());