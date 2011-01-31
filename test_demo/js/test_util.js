/** 
 * @classDescription A runner for UI/unit tests
 * @constructor
 */
define(["jquery","qunit"],function($) {
	var test_util = {};
	
	/** 
	 * Adds the qunit test results/CSS to the page
	 */
	test_util.setup = function() {
		console.info("setting up test_util");
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
		return _BM_USER_LOGIN === "superuser";
	}
	
	test_util.setup();
	
	return test_util;
});