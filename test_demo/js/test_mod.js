/**
* @namespace A module to test the module framework
* @name test_mod
*/
define(["manager"],function(mgr) {
	mgr.register("test_mod");
	
	var test_mod = {};
	
	/**
	* Test func returns a true value
	* @memberOf test_mod
	* @returns {Boolean} true
	*/
	test_mod.test_func = function() {
		return true;
	}

	//require(["test_mod_tests"]);
	
	return test_mod;
});