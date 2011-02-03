/**
 * @param dependencies {Array} name of modules this code depends on. Can exclude ".js"
 * @param callback {Function} function containing this module's functionality.
 */
require(["require_config"], function(cfg) {
  /*
   * Put all functions for homepage here
   */
   require(cfg,["mod/return_to_quote_button"],function(rtq) {
	  //this function runs when the page loads
	  require.ready(function() {
		rtq.add_button_to_homepage(rtq.v10_homepage_callback);
	  });
	});
});
