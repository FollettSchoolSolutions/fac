[![Build Status](https://travis-ci.org/FollettSchoolSolutions/fac.png?branch=master)](https://travis-ci.org/FollettSchoolSolutions/fac)
#Angular component library
This library is licensed under the MIT license.

This project houses components helpful to general application development with AngularJS.  The goal is to provide a collection of common services/directive/filters, etc that can be pulled into your projects and modified or used as is.

##Usage

####Installation

######Versions 1.2 and later
From the command line: `bower install follett-angular-components --save`

In your html file:

    <link rel="stylesheet" href="bower_components/follett-angular-componenets/dist/follett-angular-componenets.css" />
    ...
    <script src="bower_components/follett-angular-componenets/dist/follett-angular-componenets.js"></script>

######Older versions
[https://github.com/FollettSchoolSolutions/fac/tree/archive](https://github.com/FollettSchoolSolutions/fac/tree/archive)

####Versions
1.0

* Compatible with AngularJS 1.0.7

1.1

* Compatible with AngularJS 1.2.4

1.2

* Compatible with AngularJS 1.2.18

####Documentation
[http://follettschoolsolutions.github.io/fac/](http://follettschoolsolutions.github.io/fac/)

##Contributing
####Pre-requisites to building the project
* [NodeJS](http://nodejs.org/)
* Bower
  * `npm install -g bower`
* Grunt
  * `npm install -g grunt-cli`

####Guidelines

* Clone the project and create a new branch off of master
* From the root directory, run `npm install && bower install` to install project dependencies
* Add your new component to its own directory under one of the broad categories (directives/filters etc, adding a new category if applicable)
  * All directive names should have the prefix 'fss'
  * All module names should be in the form '[services|directives|filters|etc].mymodulename'
* Add the new spec file for your component to a directory named 'test' as a subfolder of the above directory
  * Look at the existing components for an example of this if you are unsure where this goes
* Test and lint it by typing `grunt` in the project root directory
* Debug the test suite in a Chrome browser by typing `grunt debug`
* Build it by typing `grunt build`. This will create a 'dist' folder with the following files:
  * projectname.js (Unminified javascript file containing concatenated result of all js files, including any directive html files)
  * projectname.min.js (Minified version of the above file)
  * projectname.css  (Unminified css file containing concatenated result of all css files)
  * projectname.min.css  (Minified version of the above file)
* Commit your changes (including files in dist) and submit a pull request to master
* After the pull request is merged, create a new release:
  * `grunt bump`
  * This will bump the patch version of the bower.json and package.json as well as create a tag for the new version and will automatically commit and push all changes.
  * If your changes are for a new minor release (meaning there are significant, yet backwards-compatible changes) use `grunt bump:minor`
  * If your changes are for a new major release (meaning there are breaking changes) use `grunt bump:major` 

* Checkout the [docs](https://github.com/FollettSchoolSolutions/fac/tree/gh-pages) project by switching to the gh-pages branch
* Follow the instructions for that project on how to add a simple usage example to the existing page


#The MIT License (MIT)
Copyright (c) 2013 Follett School Solutions, Inc.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

