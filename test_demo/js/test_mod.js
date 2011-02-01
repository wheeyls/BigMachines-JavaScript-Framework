define(["manager"],function(mgr) {
	mgr.register("test_mod");
	
	var test_mod = {};
	
	test_mod.test_func = function() {
		return true;
	}

	//require(["test_mod_tests"]);
	
	return test_mod;
});