define([],function() {
	var test_mod = {};
	
	test_mod.test_func = function() {
		return true;
	}

	function run_tests() {
		require(["test_mod_tests"],function(tests) {
			tests.run_tests();
		});
	}
	
	/* function run_tests() {
		require(["test_util"],function() {
			if(test_util.run_tests()) {
				test_util.setup();
			
				test("test_func returns true",function() {
					ok(test_mod.test_func(),"test_func didn't return true!");
				});
			}
		});
	} */
	
	run_tests();
	
	return test_mod;
});