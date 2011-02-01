define(["test_mod"],function(test_mod) {
	var tests = {};
	
	tests.run_tests = function() {
		module("test_mod");
		test("test_func returns true",function() {
			ok(test_mod.test_func(),"test_func didn't return true!");
		});
	}
	
	/* if(test_util.run_tests()) {
		run_tests();
	} */
	return tests;
});