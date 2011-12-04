/**
 * @projectDescription Main loader for test_demo
 * 
 * @author Tyler Brandt
 * @version 1.0
 */

//require(["require_config"],function(cfg) {
	require(/*cfg,*/["logger","test_mod","test_mod2","return_to_quote_button","jquery-1.5.js","jquery_cookie"],function(logger,test_mod,tm2,rtq) {
		require.ready(function() {
			//This function is called when the page is loaded (the DOMContentLoaded
			//event) and when all required scripts are loaded.

			//Do nested require() calls in here if you want to load code
			//after page load.
			
			//logger.setLogLevel("warn");
			
			jQuery.cookie("last_transaction","blah",{ path: "/"});
			
			//require(["test_mod"],function(test_mod) {
				// do some stuff with it
				logger.info("test_func returns: " + test_mod.test_func());
			//});
			
			//require(["test_mod2"],function(tm2) {
				logger.info("test_mod2 test_func returns: " + tm2.test_func());
			//});
			
		});
	});
//});
