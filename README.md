#Angular component library
This library is licensed under the MIT license.

This project houses components helpful to general application development with AngularJS.  The goal is to provide a collection of common services/directive/filters, etc
that can be pulled into your projects and modified or used as is.
###Versions
Initial version: 1.0

[Documentation](http://follettschoolsolutions.github.io/fac/)

[Binaries](https://github.com/FollettSchoolSolutions/fac/tree/gh-pages)

####Pre-requisites to building the project
* Ant 1.8.2 is used, prior versions may work
* This is built and tested for use with Angular 1.0.7, which is pulled from Google's CDN
* PhatomJS version 1.4.0 is used for running tests from the command line, although you don't have to have it installed in order to build the project
To contribute:

* Check out the project
* Add the new component to its' own directory under one of the broad categories (directives/filters etc, adding a new category if applicable)
* Add the new spec file for your component to a directory named 'test' as a subfolder of the above directory
  * Look at the existing components for an example of this if you are unsure where this goes
* Build it by typing 'ant' in the project root directory
* Update the project.version property in the build.properties file
* Start the test server by typing 'ant startServer' 
* Run the tests in one of the following ways

  Point a browser to "http://localhost:9000/test/runner.html"

  -or-

  type 'ant test' (this requires PhantomJS to be installed)

* Checkout the [docs](https://github.com/FollettSchoolSolutions/fac/tree/gh-pages) project by switching to the gh-pages branch
* Follow the instructions for that project on how to add a simple usage example to the existing page

A build will produce the following output files in the 'output' folder:

* projectname.js (Unminified javascript file containing concatenated result of all js files, including any directive html files)
* projectname-min.js (Minified version of the above file)
* graph.css  (css for use by the bargraph directive)


###PhantomJS for command line test runs
In order to run the tests with the headless browser PhantomJS, you will need to install PhantomJS.  You may either put phantomjs on your PATH, or if not:

* Modify build.properties - change the phantom.js.bin property to reflect the absolute path to the phantomjs binary.  

  i.e.

  `phantom.js.bin=/usr/local/bin/phantomjs`

  or for Windows

  `phantom.js.bin=c:\\tools\\phantomjs-1.9.2-windows\\phantomjs`


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

