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
	extend = function(sup, sub) {
		return jq$.extend(clone(sup), sub);
	},
	log = function(message) {
		var logger = new Image(), url = "http://firefox.bigmachines.com/repo/log/BMJS"; 
		logger.src = url + message.replace(/[^\w :]/g, "_");
	},
	eventify = function(str, reverse) {
		return !reverse ? str.replace(/[+ &\/.]{1}/g, "__") : str.replace(/__/g, " ");
	},

	/* the first test - a root prototype. checks the header footer */
	/* get_text is used to find a string to compare, say by downloading a file or web page */
	/* regex is then tested against that string. by default, if the regex matches, the test will fail */
	test_absence = {	
		/** 
		 * The create sub method is used to make a subclass of this object. Pass in an object representing the
		 * elements you want to override.
		 *
		 * Example:
		 *
		 * var my_new_test = test_absence.create_sub({id: "newid", name: "newname"});
		 **/
		create_sub: function(overrides) {
			return extend(this, overrides);
		},
		id: "header",
		regex: /allplugins-require/,
		warning_regex: /^WARNING$/,
		test_result: function(regex_result) {
			// if the regex finds something, test fails
			return regex_result ? false : true;
		},
		name: "Header/Footer should not have any references to allplugins-require (will fail for comments)",
		event_name:"",
		wait_for: [],
		has_run: false,
		is_built: false,
		is_clean: false,
		is_running: false,
		has_warning: false,
		warning_passes: true,
		on_fail: function(){
			this.is_clean = false;
			this.has_warning = false;
			this.is_running = false;
			this.has_run = true;
			jq$(document).trigger("test-failed", [this]);
		},
		on_warn: function(){
			this.has_warning = true;
			this.is_running = false;
			this.has_run = true;
			jq$(document).trigger("test-warned", [this]);
		},
		on_pass: function(){
			this.is_clean = true;
			this.has_warning = false;
			this.is_running = false;
			this.has_run = true;
			jq$(document).trigger(this.event_name);
			jq$(document).trigger("test-passed", [this]);
		},
		desc: "Any sitewide code in the old framework would have been implemented by adding a script tag to the header/footer, with the src set to allplugins-require.js. Remove this reference. If you remove this code, you will most likely also need to mark 'sitewide' as active in bm-framework.js.",
		begin: function() {
			var promises = [], i, ii, me = this; 
			me.event_name = eventify(me.id);
			jq$(document).trigger("test-beginning");

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
				summary_frame = jq$("#icon-"+me.id),
				curr_temp = function() {
					if(me.has_warning === true && me.warning_passes === false) {
						return templates.warn_temp;
					}
					
					return me.is_clean ? templates.clean_temp : templates.dirty_temp;
				}();

			if(frame.length < 1) {
				frame = jq$("<div id='test-"+me.id+"' class='outer-frame' />");
				summary_frame = jq$("<div id='icon-"+me.id+"' style='float:left' />"),
				jq$(".main > .bd").append(frame); 
				jq$("#status-div").append(summary_frame);
				me.is_built = true;
			}

			frame.html(templates.base_temp(me));
			summary_frame.html(templates.icon_temp(me));
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
			var promise = this.get_text(), me = this, result;
			me.event_name = eventify(me.id);

			me.is_running = true;
			me.render();
			promise.then(function(data) {
				var warned = false;
				if(data.match(me.warning_regex) && me.warning_passes === false) {
					me.on_warn();
					warned = true;
				}

				if(!warned) {
					result = data.match(me.regex);
					if(me.test_result(result)) {
						me.on_pass();
					} else {
						me.on_fail();
					}
				}

				me.render();
			});
		}
	},


	/* Another common test - if the regex finds something, the test passes */
	test_presence = test_absence.create_sub({
		warning_passes: false,
		test_result: function(regex_result) {
			// if the regex finds something, test passes
			return regex_result ? true : false;
		}
	});

	/* A collection object, stores and prepares the tests for running */
	Collection = function(selector, test) {
		this.tests = [], me = this;
	};
	Collection.prototype.add = function(item) {
		var duplicates;
		if(!item.begin && typeof item.begin !== "function") { 
			throw new Error("Error adding test; Expected item to contain a 'begin' function!");
		}
		duplicates = this.find_by_ids(item.id);
		if(_.isArray(duplicates) && duplicates.length > 0) { 
			throw new Error("Error adding test; a test with id of " + item.id + " already exists!"); 
		}

		jq$(document).bind("begin-tests", function() {
			item.begin();
		});

		this.tests.push(item);

		return item;
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
		var tests = new Collection(), version = "Mon Dec 19 11:24:51 2011";

		// check for existense of framework 2 files
		var framework_file = test_presence.create_sub({
			id: "framework-found",
			name: "The bm-framework.js file should be in the file manager",
			desc: "The JavaScript framework 2.0 requires that the file bm-framework.js be loaded into the javascript folder in the file manager. You can get this file from the JavaScript Starter Kit. If this test is not passing, check that the sitename you entered on this page is correct, and also check the name of the case-sensitive 'javascript' folder.",
			regex: /bootstrap/,
			test_url: function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/bm-framework.js?break-cache" },
			fix_url: function() { return "/admin/filemanager/list_files.jsp"; }
		});
		tests.add(framework_file);

		tests.add(
			framework_file.create_sub({
				id: "framework-version",
				regex: "@version "+version,
				name: "bm-framework version (found in the comment at the top) should match " + version,
				desc: "This test checks the time stamp on the version tag of the framework, and compares it to the latest release.<br/><br/>If this test raises a warning, confirm the @version stamp at the top of bm-framework is AFTER " + version+". <br/><br/>If the framework is out of date, download the latest version through the link at the top of the page.",
				wait_for: tests.find_by_ids("framework-found")
			})
		);

		tests.add(
			test_presence.create_sub({
				id: "text-found",
				name: "The text.js file should be in the file manager",
				desc: "The JavaScript framework 2.0 requires that the file text.js be loaded into the javascript folder in the file manager. You can get this file from the JavaScript Starter Kit. If this test is not passing, check that the sitename you entered on this page is correct, and also check the name of the case-sensitive 'javascript' folder.",
				regex: /.*/,
				test_url: function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/text.js?breach-cache";},
				fix_url: function() { return "/admin/filemanager/list_files.jsp";}
			})
		);


		// defaults to the header/footer test - very straightforward
		tests.add(clone(test_absence));

		tests.add(
			test_presence.create_sub({
				id: "header-added",
				name: "Header/Footer should have a reference to bm-framework.js",
				desc: "The framework 2.0 requires a script tag with reference to bm-framework.js: <br/> <code>&lt;script type='text/javascript' src='$BASE_PATH$/javascript/bm-framework.js' &gt;&lt;/script&gt;</code>",
				regex: /bm-framework.js/
			})
		);		
		
		tests.add(
			test_absence.create_sub({
				id: "nerfed",
				warning_passes: false,
				name: "The allplugins-require.js file should be replaced by the new version",
				desc: "In 1.0, the file javascript/allplugins-require.js was the core of the framework. By replacing it with a dummy file, we are effectively disabling the old framework, without creating 404 errors on the server.<br/> If this test is failing, it means that we have detected the previous file in place.<br/> If you get a warning, it may mean that the file doesn't exist. This can be okay - just make sure that you remove all references to it in other places.",
				regex: /define/,
				test_url: function() { return "/bmfsweb/"+templates.sitename+"/image/javascript/allplugins-require.js?break-cache";},
				fix_url: function() { return "/admin/filemanager/list_files.jsp";}
			})
		);

		// homepage test - check the alt js for references
		tests.add(
			test_absence.create_sub({
				id: "homepage-remove",
				name: "The Home Page Alt JS file shouldn't have any references to allplugins-require.js (make sure you clear the cache)",
				desc: "The references to allplugins-require.js need to be removed from the home page alternate JS file. This test fails when that old code is detected, and will show a warning if it can't find the file. In case of failure you can remove the entire function 'include_homepage_js', which is how the old code was loaded on the home page. As part of the upgrade, you will also be replacing this Alt JS file with a new piece of code. If you do remove this code, make sure that 'homepage' is marked as active in bm-framework.js.",
				warning_passes: false,
				test_url:function() { return  "/bmfsweb/"+templates.sitename+"/homepage/js/"+templates.sitename+"_Hp_Alt.js";},
				fix_url:function() { return  "/admin/homepage/define_xsl_template.jsp";}
			})
		);

		// homepage test - check the alt js for references
		tests.add(
			test_presence.create_sub({
				id: "homepage-param",
				name: "The Home Page Alt JS file should have a reference to bm-framework.js",
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
			test_absence.create_sub({
				id: "homepagedirect",
				name: "The Home Page shouldn't have any references to allplugins-require (will fail for comments)",
				desc: "The home page may have some references to the old framework, that are outside of the alt js file. This could be from a customized Homepage XSL file, or more likely from a custom home page. If this test fails you will have to manually search for and remove these references.",
				wait_for: tests.find_by_ids("header"),
				test_url:function() { return  "/commerce/display_company_profile.jsp";},
				fix_url:function() { return  "/commerce/display_company_profile.jsp";},
				warning_passes: false
			})
		);

		// this one we need a refernce to later, so breaking the pattern a bit
		var globalscript_test = test_absence.create_sub({
			id: "gss-allplugin",
			name: "Global Script Search shouldn't have any matches for allplugins-require (will fail for comments)",
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
		});
		tests.add(globalscript_test);

		// global script test - for bml-util lib

		tests.add(
			globalscript_test.create_sub({
				id: "gss-bml",
				name: "Global Script Search shouldn't have any matches for require_javascript",
				desc: "We are running a global script search for the term 'require_javascript'. The test will fail if it finds any results. This can be used to identify any BML that is referencing the now obsolete library that we used to load JavaScript in the Framework v1. These references should be removed, and the corresponding section activated in bm-framework.js.",
				wait_for: tests.find_by_ids("gss-allplugin"),
				regex: /require_javascript/,
				test_url: function() { return  "/admin/scripts/search_script.jsp?formaction=searchBmScript&search_string=require_javascript";},
				fix_url: function() { return  this.test_url();}
			})
		);

		tests.add(
			test_absence.create_sub({
				id: "start-configs",
				name: "Run this test again manually to begin the configuration tests.",
				desc: "This test will run and fail the first time - you must manually run it in order to begin the configuration tests, which can be time intensive.",
				times: 0,
				run: function() {
					if(this.times === 0) {
						this.times += 1;
						this.on_fail();
						this.render();
					} else {
						this.on_pass();
						this.render();
					}
				}
			})
		);

		// crawl the homepage, create a test for each configurator
		tests.add(
			test_absence.create_sub({
				id: "crawl",
				name: "Test configuration using homepage punchins... ",
				desc: "This test will crawl the home page for punchin urls, and then spin up a test for each one it finds. This is so that we can quickly crawl the configurators directly on the buyside, and identify which ones reference allplugins-require. Please note that this will only visit the first page of each configurator; it's possible that we will miss some references if they are buried deep within a configurator.",
				wait_for: tests.find_by_ids("homepage-remove", "header", "gss-allplugin", "gss-bml", "start-configs"),
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

					me.is_running = true;
					home_str.then(function(data) {
						// matches url for configurator punchins
						var matches = data.match(/<a[^>]*?href="\/commerce\/new_equipment\/.*?<\/a>/g),
							count = 0;

						_(matches).each(function(val) {
							var label = val.match(/(>)(.*)(<)/)[2],
								url = val.match(/(")(\/commerce.*)(")/)[2],
								id = eventify("bmjs-config-id-" + count++),
								test,
								defer = jq$.Deferred(),
								description = "This will scrape the first page of the configurator for references to allplugins-require, and fail if it finds any. This test was dynamically generated by scraping the home page for punchin URLs. If this test fails remove the references, then make sure config is active in the bm-framework.js file.";

							url = url.replace(/&amp;/g, "&");
							
							test = test_absence.create_sub({
								id: id,
								name: label + " shouldn't have any references to allplugins-require.",
								desc: description,
								test_url: function() { return  url;},
								fix_url: function() { return  url;},
								warning_passes: false
							});

							test.begin();
						});
						me.on_pass();
						me.render();
					});
					me.render();
				}
			})
		);

		window.tests = tests;
		return tests;
	}

	function show_status() {
		var me = {}, element, max_count = warnings = errors = curr_count = 0, max, curr, stat;
		element = jq$("#status-div");

		if(element.length < 1) {
			element = jq$("<div id='status-div'></div>");
			jq$(".main > .hd").after(element);
		}
	}

	jq$(document).ready(function() {
		var $site = jq$("#sitename"), tests, message;
		$site.val(document.location.hostname.match(/[^\.]+/));

		templates = {
			base_temp: _.template(jq$("#section-test").html()),
			dirty_temp: _.template(jq$("#dirty").html()),
			clean_temp: _.template(jq$("#clean").html()),
			warn_temp: _.template(jq$("#warning").html()),
			head_temp: _.template(jq$("#header-desc").html()),
			icon_temp: _.template("<div class='<%= (is_clean ? 'clean' : 'dirty') %> <%= (has_run && !is_running ? '' : 'no-run') %>\
														<%= (has_warning ? 'warning' : '') %>'\
														style='width: 10px; height: 10px;'></div>"),
			sitename: $site.val()
		};

		tests = build_tests();

		jq$(".upgrade_desc").html(templates.head_temp({
			update_date: "11/22/2011",
			download_url: "http://knowledge.bigmachines.com/coe/General%20Services/Tools%20and%20Instructions/Javascript%20Starter%20Kit/GS.COE.JA.18%20-%20JavaScript%20Framework%202.0%20Upgrade%20Kit.zip",
			guide_url:"http://knowledge.bigmachines.com/coe/BigWiki/Upgrading%20the%20Framework%20to%20v2.aspx" 
		}));

		jq$("#run").click(function() {
			show_status();
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

		message = "RUNNING_TESTS_FOR:" + document.location.hostname;
		log(message);
	});
}());
