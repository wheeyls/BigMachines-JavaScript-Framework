define([],function() {
	var logger = {};
	
	var loglevels = { err: 0, warn: 1, info: 2, debug: 3 };
	var loglevel = loglevels.debug;
	
	logger.setLogLevel = function(level) {
		loglevel = loglevels.level;
	}
	
	logger.debug = function(str) {
		if(loglevel >= loglevels.debug) {
			console.debug(str);
		}
	}
	
	logger.info = function(str) {
		if(loglevel >= loglevels.info) {
			console.info(str);
		}
	}
	
	logger.warn = function(str) {
		if(loglevel >= loglevels.warn) {
			console.warn(str);
		}
	}
	
	logger.error = function(str) {
		if(loglevel >= loglevels.err) {
			console.error(str);
		}
	}
	
	logger.debug("debugging info");
	logger.info("info");
	logger.warn("warning");
	//logger.error("error");
	logger.info("initialized logger");
	
	return logger;
});