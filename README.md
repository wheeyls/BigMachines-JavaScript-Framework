Requirements
============
In order to build a copy of the Framework and Upgrade Kits using this source, you will need Perl installed on your machine. 

You will need Node.js if you want to modify the Require library.

Building
========
The BigMachines Framework can be built using the "release_starter.pl" script found in this directory. That script will grab the expected files from the "framework" and package them as zips into the Framework Starter Kit and Upgrade Kits, along with all their documentation.

Once you've run the build command, you will probably want to zip up the contents of those folders in order to easily share the release with others.

Compiling Require
=================
The framework makes use of RequireJS, as well as the domReady Plugin. These libaries are minified using RequireJS's optimization tool, and included in the bm-framework.js file.

To compile, you will need to get NodeJS installed on your machine. Once it is setup, open a command line and change directories to the "compile-require" folder.

You can replace require.js and/or domReady.js with any version that you would like to use, and then the following command to generate a new minified version:

    node r.js -o baseUrl=. paths.requireLib=require name=before-compile include=requireLib out=after-compile.js

The result will be output to after-compile.js. To use the library in the framework, copy and paste the contents of after-compile into bm-framework.js, replacing all the content between the "====== REQUIRE ======" commented section in the source code.
