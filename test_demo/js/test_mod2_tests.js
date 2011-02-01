define(["test_util","test_mod2"],function(test_util,test_mod) {
	function run_tests() {
		module("test_mod2");
		test("test_func returns false",function() {
			ok(!test_mod.test_func(),"test_func didn't return false!");
		});
	}
	
	if(test_util.run_tests()) {
		run_tests();
	}
});