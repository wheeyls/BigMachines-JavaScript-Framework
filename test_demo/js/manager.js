/** 
* @namespace Manages common BigMachines modules
* @name manager
* @requires jquery
* @requires logger
* @requires qunit
* @constructor
*/
define(["logger","text!qunit.css","qunit"],function(logger,css) {
	// define as global to create a singleton
	// manager = manager || {};
	var manager = {};

	var modules = [];
	
	//can this be remote?
	var module_test_url = "";

	/**
	* Add module to the list of modules managed by this manager and run tests if necessary.
	* @memberOf manager
	* @param module_name {String}: name of module to register
	* @param test_module_name {String}: Optional. Name of test suite module. If not specified, defaults to {module_name}_tests
	*/
	manager.register = function(module_name,test_module_name) {
		modules.push(module_name);

		if(test_enabled()) {
			// run tests
			setup_qunit();
			//require each test separately and asynchronously
			var mod_test_name = test_module_name || module_test_url + module_name + "_tests";
			require([mod_test_name], function(test) {
				test.run_tests();
			});
			
		}
		logger.debug("registered " + module_name + ". All Modules: " + modules);
	};
	
	/** 
	* Adds the qunit test results/CSS to the page
	*/
	var setup_qunit = function() {
		// only one container on the page, crawl the DOM once
		if (jQuery("#qunit_container").length === 0) {
			console.info("setting up manager");
			var qunitContainer = document.createElement("div");
			qunitContainer.id = "qunit_container";
			jQuery(qunitContainer).append(
									"<h1 id='qunit-header'>Javascript Testing</h1>" + 
									"<h2 id='qunit-banner'></h2>" +
									"<h2 id='qunit-userAgent'></h2>" +
									"<ol id='qunit-tests'></ol>" +
									"<div id='qunit-fixture'>test markup, will be hidden</div>"
									);
			jQuery("body").append(qunitContainer);
			
			// css
			jQuery("head").append("<style>" + css + "</style>");
		}
		return;
	}
	
	/**
	* Test to see if testing funtionality is on.
	* @memberOf manager
	* @returns {Boolean} If true, run tests on modules.
	*/
	var test_enabled = function() {
		// run tests only if the user is superuser
		var user_set = typeof _BM_USER_LOGIN ==="undefined" || _BM_USER_LOGIN === "superuser";
		
		if(user_set) {
		
			// flag set in header/footer: 
			var flag_set = jQuery("#mod_mgr_run_tests").attr("value") === "true";
			if(flag_set) {
				return true;
			}
		}
		
		return false;
	};
	
	return manager;
});
