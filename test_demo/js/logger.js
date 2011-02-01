define([],function() {
	var logger = {};
	
	logger.log = function(str) {
		console.info(str);
	}
	
	return logger;
});