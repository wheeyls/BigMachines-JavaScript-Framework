/**
 * Version of homepage for 10.1 sites
 * @param dependencies {Array} name of modules this code depends on. Can exclude ".js"
 * @param callback {Function} function containing this module's functionality.
 */
require(["return_to_quote_button","jquery-1.5"],function(rtq) {
	/*
	* Put all functions for homepage here
	*/
	//this function runs when the page loads
	require.ready(function() {
		rtq.add_button_to_homepage(rtq.v10_homepage_callback);
	});
});
