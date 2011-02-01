define(["test_mod2"],function(test_mod) {
	var tests = {};
	
	tests.run_tests = function() {
		module("test_mod2");
		test("test_func returns false",function() {
			ok(!test_mod.test_func(),"test_func didn't return false!");
		});
	}
	
	/* if(test_util.run_tests()) {
		run_tests();
	} */
	
	return tests;
});