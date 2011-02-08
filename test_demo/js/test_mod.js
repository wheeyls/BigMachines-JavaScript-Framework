/**
* @namespace A module to test the module framework
* @name test_mod
* @requires manager
*/
define(["BMModule","logger"],function(mod,logger) {
	var test_mod = mod.extend("test_mod");
	
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