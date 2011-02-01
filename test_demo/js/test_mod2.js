/**
* @namespace A second module to test the module framework
* @name test_mod2
* @requires manager
*/
define(["manager"],function(mgr) {
	mgr.register("test_mod2");
	var test_mod2 = {};
	
	/**
	* Test func returns false
	* @memberOf test_mod2
	* @returns {Boolean} false
	*/
	test_mod2.test_func = function() {
		return false;
	}
	
	return test_mod2;
});