/** 
* @namespace Manages common BigMachines modules
* @constructor
*/
define(["jquery","logger","qunit"],function($,logger) {
	// define as global to create a singleton
	// manager = manager || {};
	var manager = {};

	var modules = [];
	
	//can this be remote?
	var module_test_url = "";

	/**
* Called by modules, passing in their module name as a string
*/
	manager.register = function(module_name) {
		modules.push(module_name);
		if(manager.manager_enabled()) {
			// run tests
			setup_qunit();
			//require each test separately and asynchronously
			var mod_test_name = module_test_url + module_name + "_tests";
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
		if ($("#qunitContainer") !== null) {
			manager.setup_qunit = function() {return;}
			return;
		}

		console.info("setting up manager");
		var qunitContainer = document.createElement("div");
		qunitContainer.id = "qunit_container";
		$(qunitContainer).append(
								"<h1 id='qunit-header'>Javascript Testing</h1>" + 
								"<h2 id='qunit-banner'></h2>" +
								"<h2 id='qunit-userAgent'></h2>" +
								"<ol id='qunit-tests'></ol>" +
								"<div id='qunit-fixture'>test markup, will be hidden</div>"
								);
		$("body").append(qunitContainer);
	}
	
	/**
* Test to see if this funtionality is on.
*/
	manager.manager_enabled = function() {
		// flag set in header: 
		// <input id="module_flag" type="hidden" value="true"/>
		// this could be a js var instead, so that we don't crawl the dom.
		// this is async though, so do we care?
		//var flag_set = $("#module_flag").attr("value") === "true";
		//var user_set = _BM_USER_LOGIN === "superuser";
		var user_set = true;
		//var mod_set = modules.length > 0;
		
		var result = user_set;//flag_set && user_set && mod_set;

		return result;
	};

	/* require.ready(function() {
		if( !manager.manager_enabled() ) {
			return;
		}

		setup_qunit();
		
		for(var i = 0, ii = modules.length; i<ii; i++) {
			//require each test separately and asynchronously
			var mod_test_name = module_test_url + modules[i] + "_tests";
			require([mod_test_name], function(test) {
				test.run_tests();
			});
		}
	}); */
	
	return manager;
});
