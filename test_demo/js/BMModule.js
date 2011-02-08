define(["manager","logger"],function(mgr,logger) {
	logger.debug("loading module.js");
	
	var module = {};
	
	module.properties = {
		name: "module_name",
		version: "0.1",
	};
	
	module.extend = function(props) {
		if(typeof props === "string") {
			props = { name: props };
		}
		var new_mod = jQuery.extend(true,module,{ properties: props });
		new_mod.register();
		return new_mod;
	}
		
	module.register = function() {
		mgr.register(module.properties);
	};
	
	return module;
});