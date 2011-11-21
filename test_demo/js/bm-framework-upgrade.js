(function() {
	var header_text = '\
	<p>The current version of the Framework is available for download <a href="<%= download_url %>">here</a>.</p>\
	<p>Upgrading the framework involves four key steps:</p> \
	<ol> \
		<li><b>Upload the new files</b> to the file manager. (Looks like you have done this already, if you are reading this)</li> \
		<li>Update the Header (under Admin > Header/Footer) to <b>include bm-framework.js.</b></li> \
		<li><b>Update bm-framework.js</b> to activate your code.</li> \
		<li><b>Clean up</b> any references to the previous framework.</li>\
	</ol>\
\
	<p>This tool will apply a series of tests against this site to assist you in completing these steps. This is a supplement to the guide available here: <a href="http://firefox.bigmachines.com/doku.php?id=upgrading_the_javascript_framework_to_v2">firefox.bigmachines.com/doku.php?id=upgrading_the_javascript_framework_to_v2</a></p>\
	',
	jq$ = jQuery.noConflict(),
	templates = { }, 
	Collection,
	clone = function (object) {
    function F() {}
    F.prototype = object;
    return new F;
	},
	eventify = function(str, reverse) {
		return !reverse ? str.replace(/[+ &\/]{1}/g, "___") : str.replace(/___/g, " ");
	},
	supertest = {
		id: "header",
		regex: /allplugins-require/,
		name: "Header/Footer",
		wait_for: [], 
		has_run: false,
		is_built: false,
		is_clean: false,
		is_running: false,
		has_warning: false,
		warning_passes: true,
		desc: "Any sitewide code in the old framework would have been implemented by adding a script tag to the header/footer, with the src set to allplugins-require.js. Remove this reference. If you remove this code, you will most likely also need to mark 'sitewide' as active in bm-framework.js.",
		begin: function() {
			var promises = [], i, ii, me = this;

			_(me.wait_for).each(function(val, list) {
				var curr = jq$.Deferred(), event_name = eventify(val);

				jq$(document).bind( event_name, function() {
					curr.resolve( val );
				});

				jq$(document).bind( "abort-tests", function() {
					curr.reject( val );
					jq$(document).unbind( event_name );
				});

				promises.push(curr.promise());
			});

			jq$.when.apply(me, promises).then(function() {
				me.run.call(me);
			});

			me.render();
		},
		render: function() {
			var me = this,
				frame = jq$("#test-"+me.id),
				curr_temp = function() {
					if(me.has_warning === true && me.warning_passes === false) {
						return templates.warn_temp;
					}
					
					return me.is_clean ? templates.clean_temp : templates.dirty_temp;
				}();

			if(frame.length < 1) {
				frame = jq$("<div id='test-"+me.id+"' class='outer-frame' />");
				jq$(".main > .bd").append(frame); 
				me.is_built = true;
			}

			frame.html(templates.base_temp(me));
			if(me.has_run) {
				jq$(".bd", frame).append(curr_temp(me));
			}
			jq$(".run-each", frame).click(function() {
				me.run();
				return false;
			});

			jq$(".ft .show-desc", frame).click(function() {
				jq$(".ft .desc", frame).toggle();
				return false;
			});

			return frame;
		},
		test_url: function() { return "/admin/ui/branding/edit_header_footer.jsp"},
		fix_url: function() { return "/admin/ui/branding/edit_header_footer.jsp"},
		get_text: function() {
			var defer = jq$.Deferred(), me = this;
			jq$.ajax({
				url: me.test_url(), 
				data: {}, 
				success: function(data) { 
					defer.resolve(data);
				},
				error: function(data, status, error) {
					defer.resolve("WARNING");
				},
				dataType: "text"
			});

			return defer.promise();
		},
		run: function() {
			var promise = this.get_text(), me = this;
			me.event_name = eventify(me.name);
			promise.then(function(data) {
				if(data === "WARNING" && me.warning_passes === false) {
					me.has_warning = true;
				} else if(data.match(me.regex)) {
					me.is_clean = false;
					me.has_warning = false;
				} else {
					me.is_clean = true;
					me.has_warning = false;
					jq$(document).trigger(me.event_name, [me]);
				}
				me.has_run = true;
				me.is_running = false;
				me.render();
			});
			me.is_running = true;
			me.render();
		}
	},
	positive_test = clone(supertest);
	
	positive_test.warning_passes = false;
	positive_test.run = function() {
		var promise = this.get_text(), me = this;
		me.event_name = eventify(me.name);
		promise.then(function(data) {
			if(data === "WARNING" && me.warning_passes === false) {
				me.has_warning = true;
			} else if(data.match(me.regex)) {
				me.is_clean = true;
				me.has_warning = false;
			} else {
				me.is_clean = false;
				me.has_warning = false;
				jq$(document).trigger(me.event_name, [me]);
			}
			me.has_run = true;
			me.is_running = false;
			me.render();
		});
		me.is_running = true;
		me.render();
	};

	Collection = function(selector, test) {
		this.tests = [], me = this;
	};
	Collection.prototype.add = function(item) {
		if(!item.begin && typeof item.begin !== "function") { throw new Error("Error adding test; Expected item to contain a 'begin' function!");}
		jq$(document).bind("begin-tests", function() {
			item.begin();
		});
		this.tests.push(item);
	};

	function build_tests() {
		var coll = new Collection(), curr;

		// check for existense of framework 2 files
		curr = clone(positive_test);
		curr.id = "framework-found";
		curr.name = "new bm-framework file";
		curr.desc = "The JavaScript framework 2.0 requires that the file bm-framework.js be loaded into the javascript folder in the file manager. You can get this file from the JavaScript Starter Kit. If this test is not passing, check that the sitename you entered on this page is correct, and also check the name of the case-sensitive 'javascript' folder.";
		curr.wait_for = [];
		curr.regex = /bootstrap/;
		curr.test_url = function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/bm-framework.js" };
		curr.fix_url = function() { return "/admin/filemanager/list_files.jsp"; }
		coll.add(curr);

		curr = clone(positive_test);
		curr.id = "text-found";
		curr.name = "new text js file";
		curr.desc = "The JavaScript framework 2.0 requires that the file text.js be loaded into the javascript folder in the file manager. You can get this file from the JavaScript Starter Kit. If this test is not passing, check that the sitename you entered on this page is correct, and also check the name of the case-sensitive 'javascript' folder.";
		curr.wait_for = [];
		curr.regex = /.*/;
		curr.test_url = function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/text.js";};
		curr.fix_url = function() { return "/admin/filemanager/list_files.jsp";};
		coll.add(curr);

		curr = clone(positive_test);
		curr.id = "header-added";
		curr.name = "Header/Footer - Add";
		curr.desc = "The framework 2.0 requires a script tag with reference to bm-framework.js: <br/> <code>&lt;script type='text/javascript' src='$BASE_PATH$/javascript/bm-framework.js' &gt;&lt;/script&gt;</code>";
		curr.regex = /bm-framework.js/;
		
		coll.add(curr);
		
		curr = clone(supertest);
		curr.id = "nerfed";
		curr.warning_passes = false;
		curr.name = "replace allplugins-require.js";
		curr.desc = "In 1.0, the file javascript/allplugins-require.js was the core of the framework. By replacing it with a dummy file, we are effectively disabling the old framework, without creating 404 errors on the server.<br/> If this test is failing, it means that we have detected the previous file in place.<br/> If you get a warning, it may mean that the file doesn't exist. This can be okay - just make sure that you remove all references to it in other places.";
		curr.wait_for = [];
		curr.regex = /define/;
		curr.test_url = function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/allplugins-require.js";};
		curr.fix_url = function() { return "/admin/filemanager/list_files.jsp";};
		coll.add(curr);

		// defaults to the header/footer test - very straightforward
		curr = clone(supertest);
		coll.add(curr);

		// homepage test - check the alt js for references
		curr = clone(supertest);
		curr.id = "homepage";
		curr.name = "Home Page Alt JS - remove";
		curr.desc = "The references to allplugins-require.js need to be removed from the home page alternate JS file. This test fails when that old code is detected, and will show a warning if it can't find the file. In case of failure you can remove the entire function 'include_homepage_js', which is how the old code was loaded on the home page. As part of the upgrade, you will also be replacing this Alt JS file with a new piece of code. If you do remove this code, make sure that 'homepage' is marked as active in bm-framework.js.";
		curr.wait_for = [];
		curr.warning_passes = false;
		curr.test_url =function() { return  "/bmfsweb/"+templates.sitename+"/homepage/js/"+templates.sitename+"_Hp_Alt.js";};
		curr.fix_url =function() { return  "/admin/homepage/define_xsl_template.jsp";};
		coll.add(curr);

		// homepage test - check the alt js for references
		curr = clone(positive_test);
		curr.id = "homepage-param";
		curr.name = "Home Page Alt JS - add param";
		curr.desc = "The JavaScript framework 2.0 uses an (optional) parameter to assist in identifying the home page. This file can be found in the JavaScript Start Kit; it is basically: <code>window['framework/homepage']=true</code>. If this test fails, it means that it found the Alt JS file, but no reference to the new code. A warning means it can't find the file.";
		curr.warning_passes = false;
		curr.regex = /framework\/homepage/;
		curr.wait_for = ["Home Page Alt JS - remove"];
		curr.test_url =function() { return "/bmfsweb/"+templates.sitename+"/homepage/js/"+templates.sitename+"_Hp_Alt.js";};
		curr.fix_url =function() { return "/admin/homepage/define_xsl_template.jsp";};
		coll.add(curr);

		// homepage test - check the homepage directly
		curr = clone(supertest);
		curr.id = "homepagedirect";
		curr.name = "Home Page";
		curr.desc = "The home page may have some references to the old framework, that are outside of the alt js file. This could be from a customized Homepage XSL file, or more likely from a custom home page. If this test fails you will have to manually search for and remove these references.";
		curr.wait_for = ["Header/Footer"];
		curr.test_url =function() { return  "/commerce/display_company_profile.jsp";};
		curr.fix_url =function() { return  "/commerce/display_company_profile.jsp";};
		curr.warning_passes = false;
		coll.add(curr);

		// global script test - for allplugins-require directly
		curr = clone(supertest);
		curr.id = "gss-allplugin";
		curr.name = "Global Script Search-JS";
		curr.desc = "We are running a global script search for the term 'allplugins-require'. The test will fail if it finds any results. This can be used to identify any BML that is referencing the old framework directly. All these references should be removed. This will NOT show references from default values on config attributes. This will most likely only find one reference - in our BML Util Library 'require_javascript.'";
		curr.wait_for = ["Home Page Alt JS - remove", "Header/Footer"];
		curr.test_url = function() { return  "/admin/scripts/search_script.jsp?formaction=searchBmScript&search_string=allplugins-require";};
		curr.fix_url =function() { return  curr.test_url(); };
		curr.get_text = function() {
			var defer = jq$.Deferred(), me = this;
			jq$.get(me.test_url(), {}, function(data) { 
				//get rid of the first two... we put it there!
				data = data.replace(me.regex, "");
				data = data.replace(me.regex, "");
				defer.resolve(data);
			});

			return defer.promise();
		};
		coll.add(curr);

		// global script test - for bml-util lib
		curr = clone(curr);
		curr.id = "gss-bml";
		curr.name = "Global Script Search-BML";
		curr.desc = "We are running a global script search for the term 'require_javascript'. The test will fail if it finds any results. This can be used to identify any BML that is referencing the now obsolete library that we used to load JavaScript in the Framework v1. These references should be removed, and the corresponding section activated in bm-framework.js.";
		curr.wait_for = ["Global Script Search-JS"];
		curr.regex = /require_javascript/;
		curr.test_url = function() { return  "/admin/scripts/search_script.jsp?formaction=searchBmScript&search_string=require_javascript";};
		curr.fix_url = function() { return  curr.test_url() ;};
		coll.add(curr);

		// crawl the homepage, create a test for each configurator
		curr = clone(supertest);
		curr.id = "crawl";
		curr.name = "Begin Home Page Crawl";
		curr.desc = "This test will crawl the home page for punchin urls, and then spin up a test for each one it finds. This is so that we can quickly crawl the configurators directly on the buyside, and identify which ones reference allplugins-require. Please note that this will only visit the first page of each configurator; it's possible that we will miss some references if they are buried deep within a configurator.";
		curr.wait_for = ["Header/Footer"];
		curr.regex = /require_javascript/;
		curr.test_url =function() { return  "/commerce/display_company_profile.jsp";};
		curr.fix_url =function() { return  "/commerce/display_company_profile.jsp";};
		// this test spawns additional tests
		curr.run = function() {
			var me = this,
			defer = jq$.Deferred(),
			home_str = jq$.ajax({
				url: me.test_url()
			});

			home_str.then(function(data) {
				var matches = data.match(/<a[^>]*?href="\/commerce\/new_equipment\/.*?<\/a>/g);

				_(matches).each(function(val) {
					var label = val.match(/(>)(.*)(<)/)[2],
						url = val.match(/(")(\/commerce.*)(")/)[2],
						id = eventify(label),
						test = clone(supertest)
						defer = jq$.Deferred();

					url = url.replace(/&amp;/g, "&");

					test.id=id;
					test.name=label;
					test.desc = "This will scrape the first page of the configurator for references to allplugins-require, and fail if it finds any. This test was dynamically generated by scraping the home page for punchin URLs. If this test fails remove the references, then make sure config is active in the bm-framework.js file.";
					test.test_url =function() { return  url;};
					test.fix_url =function() { return  url;};
					test.warning_passes = false;

					test.begin();
				});
				me.is_clean = true;
				me.has_run = true;
				me.is_running = false;
				me.render();
			});
			me.is_running = true;
			me.render();
		};

		coll.add(curr);
	}

	jq$(document).ready(function() {
		var $site = jq$("#sitename");
		$site.val(document.location.hostname.match(/[^\.]+/));

		templates = {
			base_temp: _.template(jq$("#section-test").html()),
			dirty_temp: _.template(jq$("#dirty").html()),
			clean_temp: _.template(jq$("#clean").html()),
			warn_temp: _.template(jq$("#warning").html()),
			head_temp: _.template(header_text),
			sitename: $site.val()
		};

		build_tests();

		jq$(".upgrade_desc").html(templates.head_temp({
			download_url: "http://knowledge.bigmachines.com/coe/General%20Services/Tools%20and%20Instructions/Javascript%20Starter%20Kit/GS.COE.JA.18%20-%20JavaScript%20Framework%202.0%20Upgrade%20Kit.zip"
		}));

		jq$("#run").click(function() {
			templates.sitename = $site.val();
			jq$(document).trigger("abort-tests");
			jq$(document).trigger("begin-tests");
			return false;
		});

		jq$(".ignore").live("click", function() {
			var evt = jq$(this).data("event");
			jq$(document).trigger( eventify(evt) );
			return false;
		});
	});
}());
