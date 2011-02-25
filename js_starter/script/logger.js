/**
* @namespace A utility for logging messages to the console
* @name logger
*/
define([],function() {
	
	var logger = {};
	
	var loglevels = { error: 0, warn: 1, info: 2, debug: 3 };
	var loglevel = loglevels.debug;

	/**
	* Set the logger's log level. If the logger's log level is less than the level of the message, the message will not be displayed. e.g. logger.warn will be displayed if logger's level is warn, info, or debug.
	* @memberOf logger
	* @param level {String}: One of [error < warn < info < debug]
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
		if(typeof console !== 'object' || !('debug' in console)) {return;}
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
		if(typeof console !== 'object' || !('info' in console)) {return;}
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
		if(typeof console !== 'object' || !('warn' in console)) {return;}
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
		if(typeof console !== 'object' || !('error' in console)) {return;}
		if(loglevel >= loglevels.error) {
			console.error(str);
		}
	}
	
	var test = function() {
		logger.debug("debugging info");
		logger.info("info");
		logger.warn("warning");
		//logger.error("error");
		logger.debug("initialized logger");
	}
	
	return logger;
});
