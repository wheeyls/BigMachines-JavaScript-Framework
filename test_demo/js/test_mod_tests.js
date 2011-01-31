define(["test_util","test_mod"],function(test_util,test_mod) {
	function run_tests() {
		module("test_mod");
		test("test_func returns true",function() {
			ok(test_mod.test_func(),"test_func didn't return true!");
		});
	}
	
	run_tests();
});