/**
 * @projectDescription Main loader for test_demo
 * 
 * @author Tyler Brandt
 * @version 1.0
 */

require(["jquery-1.5"],function() {
	require(["copy_value"],function(cpv) {
		require.ready(function() {
			//This function is called when the page is loaded (the DOMContentLoaded
			//event) and when all required scripts are loaded.

			//Do nested require() calls in here if you want to load code
			//after page load.
			
		});
	});
});