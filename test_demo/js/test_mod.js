/**
* @namespace A module to test the module framework
* @name test_mod
* @requires manager
*/
define(["manager","logger"],function(mod,logger) {
	mod.register({ name: "test_mod", version: "0.5" });
	
	var test_mod = {};
	
	/**
	* Test func returns a true value
	* @memberOf test_mod
	* @returns {Boolean} true
	*/
	test_mod.test_func = function() {
		return true;
	}
	
	return test_mod;
});