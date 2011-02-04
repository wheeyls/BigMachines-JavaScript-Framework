/**
* This module abstracts loading of jQuery, taking care of conflicts
* @namespace
* @name with_jquery
*/
define([],function() {
	var with_jquery = {};
	
	var jquery_script = "jquery-1.5";
	
	/** Set the version of the jquery script to use. Default 1.5
	* @param version {String} filename of the jquery script to use, without extension
	* @memberOf with_jquery
	*/
	with_jquery.set_jquery_version = function(version) {
		jquery_script = version;
	}
	
	/** Call jQuery-requiring code within this block
	* @example 
	* require(["with_jquery"],function(with_jquery) {
	*	with_jquery.with_jquery(function() {
	*		jQuery("body").append("hi from jQuery!");
	*		require(["some-module"],function(mod) {
	*			// some-module inherits the jQuery, so no need to require it again
	*		});
	*	});
	* });
	* @param function {Function} Should be a function with no arguments. When referring to jQuery, you must use "jQuery"
	*/
	with_jquery.with_jquery = function(fn) {
		if(typeof jQuery === "function") {
			require([],fn);
		} else {
			require([jquery_script],function() {
				$.noConflict();
				fn();
			});
		}
	}

	return with_jquery;
});