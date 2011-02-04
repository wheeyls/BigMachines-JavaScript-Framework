define([],function() {
	var with_jquery = {};
	
	with_jquery.with_jquery = function(fn) {
		if(typeof jQuery === "function") {
			require([],fn);
		} else {
			require(["jquery-1.5"],function() {
				$.noConflict();
				fn();
			});
		}
	}

	return with_jquery;
});