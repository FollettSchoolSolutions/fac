[![Build Status](https://travis-ci.org/FollettSchoolSolutions/fac.png?branch=master)](https://travis-ci.org/FollettSchoolSolutions/fac)
#Angular component library
This library is licensed under the MIT license.

This project houses components helpful to general application development with AngularJS.  The goal is to provide a collection of common services/directive/filters, etc
that can be pulled into your projects and modified or used as is.
###Versions
1.0

* Compatible with AngularJS 1.0.7

1.1

* Compatible with AngularJS 1.2.4

1.2

* Compatible with AngularJS 1.2.18

[Documentation](http://follettschoolsolutions.github.io/fac/)

[Binaries](https://github.com/FollettSchoolSolutions/fac/tree/gh-pages)

####Pre-requisites to building the project
* [NodeJS](http://nodejs.org/)
* Bower
  * `npm install -g bower`
* Grunt
  * `npm install -g grunt-cli`

####Contributing

* Check out the project
* Add the new component to its' own directory under one of the broad categories (directives/filters etc, adding a new category if applicable)
* Add the new spec file for your component to a directory named 'test' as a subfolder of the above directory
  * Look at the existing components for an example of this if you are unsure where this goes
* Test and lint it by typing `grunt` in the project root directory
* Debug the test suite in a Chrome browser by typing `grunt debug`
* Build it by typing `grunt build`

* Checkout the [docs](https://github.com/FollettSchoolSolutions/fac/tree/gh-pages) project by switching to the gh-pages branch
* Follow the instructions for that project on how to add a simple usage example to the existing page

A build will produce the following files in the 'dist' folder:

* projectname.js (Unminified javascript file containing concatenated result of all js files, including any directive html files)
* projectname.min.js (Minified version of the above file)
* projectname.css  (Unminified css file containing concatenated result of all css files)
* projectname.min.css  (Minified version of the above file)

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

