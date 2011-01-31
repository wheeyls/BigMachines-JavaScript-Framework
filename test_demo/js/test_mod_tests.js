define(["test_util","test_mod"],function(test_util,test_mod) {
	var test_mod_tests = {};
	
	test_mod_tests.run_tests = function() {
		test_util.setup();
		
		test("test_func returns true",function() {
			ok(test_mod.test_func(),"test_func didn't return true!");
		});
	}
	
	return test_mod_tests;
});