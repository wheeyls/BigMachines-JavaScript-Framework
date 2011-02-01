/**
* @namespace A utility for logging messages to the console
* @name logger
*/
define([],function() {
	var logger = {};
	
	var loglevels = { error: 0, warn: 1, info: 2, debug: 3 };
	var loglevel = loglevels.debug;
	
	/**
	* Set the loggers log level
	* @memberOf logger
	* @param level {String}: One of [error,warn,info,debug]
	*/
	logger.setLogLevel = function(level) {
		loglevel = loglevels.level;
	}
	
	/**
	* Log a debug message (white)
	* @memberOf logger
	* @param str {String}: The string to write
	*/
	logger.debug = function(str) {
		if(loglevel >= loglevels.debug) {
			console.debug(str);
		}
	}
	
	/**
	* Log an info message (blue)
	* @memberOf logger
	* @param str {String}: The string to write
	*/
	logger.info = function(str) {
		if(loglevel >= loglevels.info) {
			console.info(str);
		}
	}
	
	/**
	* Log a warning message (yellow)
	* @memberOf logger
	* @param str {String}: The string to write
	*/
	logger.warn = function(str) {
		if(loglevel >= loglevels.warn) {
			console.warn(str);
		}
	}
	
	/**
	* Log an error message (red)
	* @memberOf logger
	* @param str {String}: The string to write
	*/
	logger.error = function(str) {
		if(loglevel >= loglevels.err) {
			console.error(str);
		}
	}
	
	var test = function() {
		logger.debug("debugging info");
		logger.info("info");
		logger.warn("warning");
		//logger.error("error");
		logger.info("initialized logger");
	}
	
	test();
	
	return logger;
});