define([], function() {
	var me = {};

	me.run = function(testee) {

		test("activate loads a file if all tests pass", function() {
			testee.pages["testpage"] = {regex: [], match: function() {return true;}};
			
			//testee.activate("testpage");
		});
	};

	return me;
});
