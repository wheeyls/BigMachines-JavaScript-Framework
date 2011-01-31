define(["test_util"],function(test_util) {
	var test_mod = {};
	
	test_mod.test_func = function() {
		return true;
	}

	test_mod.run_tests = function() {
		test_util.setup();
	
		test("test_func returns true",function() {
			ok(test_mod.test_func(),"test_func didn't return true!");
		});
	}
	
	return test_mod;
});