define([], function() {
	var me = {};

	me.run = function(testee) {
		test("starting", function() {
			ok(true);
		});
	};

	return me;
});
