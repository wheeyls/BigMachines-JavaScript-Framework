/*global define, _BM_USER_LOGIN, document, jQuery, require */

/** 
* @namespace Manages common BigMachines modules
* @name manager
* @requires logger
* @constructor
* @version 02/25/2011
*/
define(["logger"], function (logger) {
	var manager = {}, modules = [], test_enabled, setup_qunit;

	/**
	* Test to see if testing funtionality is on. Tests if the user is superuser and the #mod_mgr_run_tests flag is true
	* @returns {Boolean} If true, run tests on modules.
	*/
	test_enabled = function () {
		// run tests only if the user is superuser
		var flag, user_set;
		
		user_set = typeof _BM_USER_LOGIN === "undefined" || _BM_USER_LOGIN === "superuser";
		
		if(user_set) {
		
			// flag set in header/footer: 
			flag = document.getElementById("mod_mgr_run_tests");
			return flag && flag.value === "true";
		}
		
		return false;
	};
	
	/** 
	* Adds the qunit test results/CSS to the page
	*/
	setup_qunit = function() {
		// only one container on the page, crawl the DOM once
		if (typeof jQuery === "function" && jQuery("#qunit_container").length === 0) {
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
			require(["text!qunit.css"],function(css) {
				jQuery("head").append("<style>" + css + "</style>");
			});
		}
		return;
	};
	
	/**
	* Add module to the list of modules managed by this manager and run tests if necessary.
	* @memberOf manager
	
	* @example
	manager.register("my_module");
	* @example
	manager.register({name: "my_module", test_name: "mod_tests"});
	* 
	* @param properties {Object/String} If String, name of module to register; otherwise specify the following properties:
	* @param properties.name {String} Name of the module
	* @param properties.test_name {String} Name of the test module (default "{module_name}_tests")
	*/
	manager.register = function(properties) {
		var module_name, test_module_name, mod_test_name;
		
		if(typeof properties === "string") {
			properties = { name: properties };
		}
		logger.debug("registering: " + properties.name);
		module_name = properties.name;
		modules.push(module_name);

		if(test_enabled()) {
			// run tests
			setup_qunit();
			//require each test separately and asynchronously
			test_module_name = properties.test_name;
			mod_test_name = test_module_name || module_name + "_tests";
			logger.debug("loading test for " + mod_test_name);
			
			require([mod_test_name,"qunit"], function(test) {
				test.run_tests("#qunit-fixture");
			});
			
		}
	};
	
	return manager;
});
