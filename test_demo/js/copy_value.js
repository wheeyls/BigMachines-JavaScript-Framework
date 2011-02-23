define(["manager","logger"],function(mgr,logger) {
	mgr.register("copy_value");
	var copy_value = {};
	
	copy_value.copy_value = function(from,to,context) {
		context = context || document;
		var fromValue = jQuery("*[name='" + from + "']",context).val();
		jQuery("*[name='" + to + "']",context).val(fromValue);
		return;
	}
	
	return copy_value;
});