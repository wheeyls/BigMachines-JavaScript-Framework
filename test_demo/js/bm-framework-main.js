require([], function() {
	var pages = init_pages(), window_url = document.location.href;

	// ==============================
	// ==== Begin Coding Section ====
	// ==============================
	pages.run("sitewide", function() {
		
	});
	pages.run("commerce", function() {

	});
	pages.run("commerce_line", function() {
		
	});
	pages.run("config", function() {
		
	});
	pages.run("homepage", function() {
		
	});
	// ==============================
	// ===== End Coding Section =====
	// ==============================

	function init_pages() {
		return {
			sitewide: { 
				regex: [], 
				match: function() {return true}
			},
			commerce: {
				regex: [],
				match: function() {return true}
			},
			commerce_line: {
				regex:[],
				match: function() {return true}
			},
			config: {
				regex:[],
				match: function() {return true}
			},
			homepage: {
				regex: [],
				match: function() {return true}
			},
			run: function(name, callback) {
				if(check_if_valid(name) === true) {
					callback();
				}
			}
		};
	}

	function check_if_valid(name) {
		var page = pages[name];
		if(!page) {
			throw new Error("Problem initiating BigMachines JavaScript framework. File "+ name + " has not been configured.");
		}
		if(test_regex(page) !== true) {return;}
		if(test_match(page) !== true) {return;}
		
		return true;
	}

	function test_regex(page) {
		var i, ii, regex = page.regex || [];
		if(regex.length === 0) {return true;}

		for(i = 0, ii = regex.length; i<ii; i++) {
			if(window_url.search(regex[i]) > -1) {
				return true;
			}
		}

		return false;
	}

	function test_match(page) {
		var test = page.match || function() {return true;}

		return test();
	}

	require.ready(function() {
		require(["bm-framework-main-tests"], function(tests){
			var wanted = {
				pages: pages
			};
			tests.run(wanted);
		});
	});
});
