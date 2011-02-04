define([],function() {
	var with_jquery = {};
	
	var jquery_script = "jquery-1.5";
	
	with_jquery.set_jquery_version = function(version) {
		jquery_script = version;
	}
	
	with_jquery.with_jquery = function(fn) {
		if(typeof jQuery === "function") {
			require([],fn);
		} else {
			require([jquery_script],function() {
				$.noConflict();
				fn();
			});
		}
	}

	return with_jquery;
});