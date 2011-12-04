/**
 * BigMachines standard JS Module loading
 * Michael Wheeler 06/07/2011
 * 
 * Set up script loading, and then require the homepage files
 */
(function() {
	var sitename = typeof _BM_HOST_COMPANY !== "undefined" ? _BM_HOST_COMPANY : undefined;
	if(!sitename) {return;}

	load_js("/bmfsweb/"+sitename+"/image/javascript/allplugins-require.js", function() {
		require(["homepage"]);
	});

	// First parameter is url of a script
	// The second parameter is a function to run when the JavaScript is ready
	function load_js(url, callback) {
		var script = document.createElement("script");
		script.setAttribute("src",url);
		script.setAttribute("type","text/javascript");
		script.onload = callback;
		script.onreadystatechange = function() {
			if (script.readyState === 'loaded' || script.readyState === 'complete') {
				callback();
				script.onreadystatechange = script.onload = null; // run once only
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	}
}());
