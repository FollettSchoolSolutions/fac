/*
* FSS Angular component library
* Copyright 2015, Follett School Solutions, Inc.
* Licensed under the MIT license http://opensource.org/licenses/MIT
*/

/**
 * Example to show how fssDelayedChange works.
 */
angular.module('delayedchangeEx', [])
  .controller('DelayedChangeCtrl', function () {

    this.textColor = 'black';
    this.ngChangeColor = this.textColor;
    this.fssDelayedChangeColor = this.textColor;

    this.ngChangeFn = function () {
      this.ngChangeColor = this.textColor;
    };

    this.fssDelayedChangeFn = function () {
      this.fssDelayedChangeColor = this.textColor;
    };
  });
