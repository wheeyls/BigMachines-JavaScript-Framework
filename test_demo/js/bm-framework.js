(function() {
	var setup = {}, init, inc;

	/**
	 * This is the setup section of the BigMachines JavaScript Framework.
	 * Set "active" to true for any pages that you want to load.
	 * Then write your code in the corresponding file in the File Manager
	 */
	setup.pages = [
		{name:"homepage",	active:true},
		{name:"commerce",	active:true},
		{name:"commerce_line",	active:true},
		{name:"config",	active:true},
		{name:"sitewide",	active:true}
	];
	/** 
	 * END OF SETUP SECTION
	 **/
	
	/** 
	 * These functions bootstrap the framework. Do not touch!
	 */
	inc = function(p) {var s = document.createElement("script");s.setAttribute("src",p);s.setAttribute("type","text/javascript");document.getElementsByTagName("head")[0].appendChild(s);}
	init = function() {
		var go = false, pages = setup.pages, i;
		for(i in pages) {
			if(!pages.hasOwnProperty(i)) {continue;} 
			if(pages[i].active === true) { go=true; break; }
		}
		if(!go) {return;}
		if(typeof _BM_HOST_COMPANY !== "string") {
			throw new Error("BigMachines Framework Critical Error. Can't determine the path to the file manager for this site, because _BM_HOST_COMPANY is not available.");
		}
		inc("/bmfsweb/" + _BM_HOST_COMPANY + "/image/javascript/bm-framework-support.js");
		window["bm-framework/setup"] = setup;
	}
	init();
}());
