/**
* Wrapper around jQuery
*/
define(function() {
	jQ = jQuery;
	if(typeof jQ !== "function") {
		require(["jquery-1.4.4"],function() {
			jQ = jQuery;			
		});
		return jQ;
	} else {
		return jQ;
	}
});