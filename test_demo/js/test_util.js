/** 
 * @classDescription A runner for UI/unit tests
 * @constructor
 */
define(["jquery","logger","qunit"],function($,logger) {
	
	var test_util = {};
	
	/** 
	 * Adds the qunit test results/CSS to the page
	 */
	test_util.setup = function() {
		logger.log("setting up test_util");
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
	
	test_util.run_tests = function() {
		return typeof _BM_USER_LOGIN === "undefined" || _BM_USER_LOGIN === "tbrandt";
	}
	
	test_util.setup();
	logger.log("loaded test_util");
	
	return test_util;
});