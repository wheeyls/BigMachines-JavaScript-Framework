Requirements
============
In order to build a copy of the Framework and Upgrade Kits using this source, you will need Perl installed on your machine. 

You will need Node.js if you want to modify the Require library.

Building
========
The BigMachines Framework can be built using the "release_starter.pl" script found in this directory. That script will grab the expected files from the "framework" and package them as zips into the Framework Starter Kit and Upgrade Kits, along with all their documentation.

Once you've run the build command, you will probably want to zip up the contents of those folders in order to easily share the release with others.

Upgrade.html
============
Upgrade.html is driven by the js file bm-framework-upgrade.js, found under framework/js. There is a variable holding the version date that should be updated after a new version has been generated.

After modifying the file, upload it to resources, in the internal folder. That way all sites will immediately have a reference to the latest version.

Compiling Require
=================
The framework makes use of RequireJS, as well as the domReady Plugin. These libaries are minified using RequireJS's optimization tool, and included in the bm-framework.js file.

To compile, you will need to get NodeJS installed on your machine. Once it is setup, open a command line and change directories to the "compile-require" folder.

You can replace require.js and/or domReady.js with any version that you would like to use, and then the following command to generate a new minified version:

    node r.js -o baseUrl=. paths.requireLib=require name=setup-domready include=requireLib out=after-compile.js

The result will be output to after-compile.js. To use the library in the framework, copy and paste the contents of after-compile into bm-framework.js, replacing all the content between the "====== REQUIRE ======" commented section in the source code.

TESTS
=====
There are a few test suites setup to test the framework, that should be kept passing when rolling out releases.

####framework/js/upgrade.html
This is the file distributed with the framework, that is responsible for making sure that a given site has been setup properly. The file is driven by bm-framework-upgrade.js, which is hosted remotely. This means that now and in the future we can create new tests, and users will be able to run those tests against their sites immediately.

####framework/tests.html
This is a test suite to be run against the framework itself. It exercises the internals of bm-framework.js, and should always be passing before rolling out a release. Any new development to the framework should also be tested within this framework.
