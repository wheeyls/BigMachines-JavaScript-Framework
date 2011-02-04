define([],function() {
	var jq_inner = {};
	
	jq_inner.test = function() {
		jQuery("body").append("<div id='jq_inner_div'>hi from jq_inner! version is: " + jQuery.fn.jquery + "</div>");
	}
	
	return jq_inner;
});