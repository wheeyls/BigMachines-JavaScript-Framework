/**
 * Michael Wheeler 11/22/2011
 * This is the BigMachines JavaScript Framework Upgrade helper.
 *
 * This file is designed to live on a shared remote server - say resources - and loaded from a BigMachine's 
 * site in the file manager, via its pair: upgrade.html 
 *
 * By having every site that uses the framework link to this file, we give admins an easy way to perform upgrades
 * now and in the future.
 *
 * @requires jquery 1.6.3 and underscore 1.1.7  
 **/

(function() {
	var jq$ = jQuery.noConflict(),
	templates = { }, 
	Collection,
	clone = function (object) {
    function F() {}
    F.prototype = object;
    return new F;
	},
	eventify = function(str, reverse) {
		return !reverse ? str.replace(/[+ &\/]{1}/g, "__") : str.replace(/__/g, " ");
	},

	/* the first test - a root prototype. checks the header footer */
	/* get_text is used to find a string to compare, say by downloading a file or web page */
	/* regex is then tested against that string. by default, if the regex matches, the test will fail */
	supertest = {
		id: "header",
		regex: /allplugins-require/,
		name: "Header/Footer",
		event_name:"",
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
			me.event_name = eventify(me.id);

			_(me.wait_for).each(function(test, list) {
				var defer = jq$.Deferred(),
					event_name = eventify(test.id);

				jq$(document).bind( event_name, function() {
					defer.resolve( test );
				});

				jq$(document).bind( "abort-tests", function() {
					defer.reject( test );
					jq$(document).unbind( event_name );
				});

				promises.push(defer.promise());
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
			me.event_name = eventify(me.id);
			promise.then(function(data) {
				//warning
				if(data === "WARNING" && me.warning_passes === false) {
					me.has_warning = true;
				//fail
				} else if(data.match(me.regex)) {
					me.is_clean = false;
					me.has_warning = false;
				//pass
				} else {
					me.is_clean = true;
					me.has_warning = false;
					jq$(document).trigger(me.event_name);
				}
				me.has_run = true;
				me.is_running = false;
				me.render();
			});
			me.is_running = true;
			me.render();
		}
	},


	/* Another common test - if the regex finds something, the test passes */
	positive_test = clone(supertest);
	jq$.extend(positive_test, {
		warning_passes: false,
		run: function() {
			var promise = this.get_text(), me = this;
			me.event_name = eventify(me.id);

			promise.then(function(data) {
				//warning
				if(data === "WARNING" && me.warning_passes === false) {
					me.has_warning = true;
				//pass
				} else if(data.match(me.regex)) {
					me.is_clean = true;
					me.has_warning = false;
					jq$(document).trigger(me.event_name);
				//fail
				} else {
					me.is_clean = false;
					me.has_warning = false;
				}
				me.has_run = true;
				me.is_running = false;
				me.render();
			});
			me.is_running = true;
			me.render();
		}
	});

	/* A collection object, stores and prepares the tests for running */
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
	//pass in ids as comma separated strings
	Collection.prototype.find_by_ids = function() {
		var result = [], me = this;
		
		_(arguments).each(function(id) {
			var item = _(me.tests).find(function(val) {
				return val.id === id;
			});

			if(item) {
				result.push(item);
			}
		});

		return result;
	};


	/** 
	 * This function builds a list of tests, and adds them to a collection 
	 * To add your own tests, simply clone a test that is similar to what you want, 
	 * and then override any properties that you need to. Add it to the tests Collection
	 * to have it run along with the other tests.
	 *
	 * Please note that every test MUST have a unique ID to run properly.
	 **/
	function build_tests() {
		var tests = new Collection();

		// check for existense of framework 2 files
		tests.add(
			jq$.extend(clone(positive_test), {
				id: "framework-found",
				name: "new bm-framework file",
				desc: "The JavaScript framework 2.0 requires that the file bm-framework.js be loaded into the javascript folder in the file manager. You can get this file from the JavaScript Starter Kit. If this test is not passing, check that the sitename you entered on this page is correct, and also check the name of the case-sensitive 'javascript' folder.",
				regex: /bootstrap/,
				test_url: function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/bm-framework.js" },
				fix_url: function() { return "/admin/filemanager/list_files.jsp"; }
			})
		);

		tests.add(
			jq$.extend(clone(positive_test), {
				id: "text-found",
				name: "new text js file",
				desc: "The JavaScript framework 2.0 requires that the file text.js be loaded into the javascript folder in the file manager. You can get this file from the JavaScript Starter Kit. If this test is not passing, check that the sitename you entered on this page is correct, and also check the name of the case-sensitive 'javascript' folder.",
				regex: /.*/,
				test_url: function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/text.js";},
				fix_url: function() { return "/admin/filemanager/list_files.jsp";}
			})
		);

		tests.add(
			jq$.extend(clone(positive_test), {
				id: "header-added",
				name: "Header/Footer - Add",
				desc: "The framework 2.0 requires a script tag with reference to bm-framework.js: <br/> <code>&lt;script type='text/javascript' src='$BASE_PATH$/javascript/bm-framework.js' &gt;&lt;/script&gt;</code>",
				regex: /bm-framework.js/
			})
		);		
		
		tests.add(
			jq$.extend(clone(supertest), {
				id: "nerfed",
				warning_passes: false,
				name: "replace allplugins-require.js",
				desc: "In 1.0, the file javascript/allplugins-require.js was the core of the framework. By replacing it with a dummy file, we are effectively disabling the old framework, without creating 404 errors on the server.<br/> If this test is failing, it means that we have detected the previous file in place.<br/> If you get a warning, it may mean that the file doesn't exist. This can be okay - just make sure that you remove all references to it in other places.",
				regex: /define/,
				test_url: function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/allplugins-require.js";},
				fix_url: function() { return "/admin/filemanager/list_files.jsp";}
			})
		);

		// defaults to the header/footer test - very straightforward
		tests.add(clone(supertest));

		// homepage test - check the alt js for references
		tests.add(
			jq$.extend(clone(supertest), {
				id: "homepage-remove",
				name: "Home Page Alt JS - remove",
				desc: "The references to allplugins-require.js need to be removed from the home page alternate JS file. This test fails when that old code is detected, and will show a warning if it can't find the file. In case of failure you can remove the entire function 'include_homepage_js', which is how the old code was loaded on the home page. As part of the upgrade, you will also be replacing this Alt JS file with a new piece of code. If you do remove this code, make sure that 'homepage' is marked as active in bm-framework.js.",
				warning_passes: false,
				test_url:function() { return  "/bmfsweb/"+templates.sitename+"/homepage/js/"+templates.sitename+"_Hp_Alt.js";},
				fix_url:function() { return  "/admin/homepage/define_xsl_template.jsp";}
			})
		);

		// homepage test - check the alt js for references
		tests.add(
			jq$.extend(clone(positive_test), {
				id: "homepage-param",
				name: "Home Page Alt JS - add param",
				desc: "The JavaScript framework 2.0 uses an (optional) parameter to assist in identifying the home page. This file can be found in the JavaScript Start Kit; it is basically: <code>window['framework/homepage']=true</code>. If this test fails, it means that it found the Alt JS file, but no reference to the new code. A warning means it can't find the file.",
				warning_passes: false,
				regex: /framework\/homepage/,
				wait_for: tests.find_by_ids("homepage-remove"),
				test_url:function() { return "/bmfsweb/"+templates.sitename+"/homepage/js/"+templates.sitename+"_Hp_Alt.js";},
				fix_url:function() { return "/admin/homepage/define_xsl_template.jsp";}
			})
		);


		// homepage test - check the homepage directly
		tests.add(
			jq$.extend(clone(supertest), {
				id: "homepagedirect",
				name: "Home Page",
				desc: "The home page may have some references to the old framework, that are outside of the alt js file. This could be from a customized Homepage XSL file, or more likely from a custom home page. If this test fails you will have to manually search for and remove these references.",
				wait_for: tests.find_by_ids("header"),
				test_url:function() { return  "/commerce/display_company_profile.jsp";},
				fix_url:function() { return  "/commerce/display_company_profile.jsp";},
				warning_passes: false
			})
		);

		// global script test - for allplugins-require directly
		var globalscript_test = clone(supertest);
		tests.add(
			jq$.extend(globalscript_test, {
				id: "gss-allplugin",
				name: "Global Script Search-JS",
				desc: "We are running a global script search for the term 'allplugins-require'. The test will fail if it finds any results. This can be used to identify any BML that is referencing the old framework directly. All these references should be removed. This will NOT show references from default values on config attributes. This will most likely only find one reference - in our BML Util Library 'require_javascript.'",
				wait_for: tests.find_by_ids("homepage-remove", "header"),
				test_url: function() { return  "/admin/scripts/search_script.jsp?formaction=searchBmScript&search_string=allplugins-require";},
				fix_url:function() { return  this.test_url(); },
				get_text: function() {
					var defer = jq$.Deferred(), me = this;
					jq$.get(me.test_url(), {}, function(data) { 
						//get rid of the first two... we put it there!
						data = data.replace(me.regex, "");
						data = data.replace(me.regex, "");
						defer.resolve(data);
					});

					return defer.promise();
				}
			})
		);

		// global script test - for bml-util lib

		tests.add(
			jq$.extend(clone(globalscript_test), {
				id: "gss-bml",
				name: "Global Script Search-BML",
				desc: "We are running a global script search for the term 'require_javascript'. The test will fail if it finds any results. This can be used to identify any BML that is referencing the now obsolete library that we used to load JavaScript in the Framework v1. These references should be removed, and the corresponding section activated in bm-framework.js.",
				wait_for: tests.find_by_ids("gss-allplugin"),
				regex: /require_javascript/,
				test_url: function() { return  "/admin/scripts/search_script.jsp?formaction=searchBmScript&search_string=require_javascript";},
				fix_url: function() { return  this.test_url();}
			})
		);

		// crawl the homepage, create a test for each configurator
		tests.add(
			jq$.extend(clone(supertest), {
				id: "crawl",
				name: "Begin Home Page Crawl",
				desc: "This test will crawl the home page for punchin urls, and then spin up a test for each one it finds. This is so that we can quickly crawl the configurators directly on the buyside, and identify which ones reference allplugins-require. Please note that this will only visit the first page of each configurator; it's possible that we will miss some references if they are buried deep within a configurator.",
				wait_for: tests.find_by_ids("homepage-remove", "header"),
				regex: /require_javascript/,
				test_url:function() { return  "/commerce/display_company_profile.jsp";},
				fix_url:function() { return  "/commerce/display_company_profile.jsp";},
				// this test spawns additional tests
				run: function() {
					var me = this,
					defer = jq$.Deferred(),
					home_str = jq$.ajax({
						url: me.test_url()
					});

					home_str.then(function(data) {
						// matches url for configurator punchins
						var matches = data.match(/<a[^>]*?href="\/commerce\/new_equipment\/.*?<\/a>/g);

						_(matches).each(function(val) {
							var label = val.match(/(>)(.*)(<)/)[2],
								url = val.match(/(")(\/commerce.*)(")/)[2],
								id = eventify(label),
								test = clone(supertest),
								defer = jq$.Deferred()
								description = "This will scrape the first page of the configurator for references to allplugins-require, and fail if it finds any. This test was dynamically generated by scraping the home page for punchin URLs. If this test fails remove the references, then make sure config is active in the bm-framework.js file.";

							url = url.replace(/&amp;/g, "&");
							
							jq$.extend(test, {
								id: id,
								name: label,
								desc: description,
								test_url: function() { return  url;},
								fix_url: function() { return  url;},
								warning_passes: false
							});

							test.begin();
						});
						me.is_clean = true;
						me.has_run = true;
						me.is_running = false;
						me.render();
					});
					me.is_running = true;
					me.render();
				}
			})
		);

		window.tests = tests;
		return tests;
	}

	jq$(document).ready(function() {
		var $site = jq$("#sitename"), tests;
		$site.val(document.location.hostname.match(/[^\.]+/));

		templates = {
			base_temp: _.template(jq$("#section-test").html()),
			dirty_temp: _.template(jq$("#dirty").html()),
			clean_temp: _.template(jq$("#clean").html()),
			warn_temp: _.template(jq$("#warning").html()),
			head_temp: _.template(jq$("#header-desc").html()),
			sitename: $site.val()
		};

		tests = build_tests();

		jq$(".upgrade_desc").html(templates.head_temp({
			update_date: "11/22/2011",
			download_url: "http://knowledge.bigmachines.com/coe/General%20Services/Tools%20and%20Instructions/Javascript%20Starter%20Kit/GS.COE.JA.18%20-%20JavaScript%20Framework%202.0%20Upgrade%20Kit.zip",
			guide_url:"http://knowledge.bigmachines.com/coe/BigWiki/Upgrading%20the%20Framework%20to%20v2.aspx" 
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
