define([],function() {
	var test_mod = {};
	
	test_mod.test_func = function() {
		return false;
	}

	require(["test_mod2_tests"]);
	
	return test_mod;
});