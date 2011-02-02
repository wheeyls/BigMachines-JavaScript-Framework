define(["return_to_quote_button", "jquery.cookie"],function(rtq) {
	var tests = {};
	
	tests.run_tests = function(test_fixture) {
		module("Homepage functions: Quickstart 11.");
		test("adding button v11 homepage",function() {
			var context = "v11test";
			var contextID = "#" + context;
			jQuery(test_fixture).append("<div id='" + context +"'>" +
												"<div class='return-to-quote'></div>" +
											"</div>");
			rtq.add_button_to_homepage(null,contextID);
			var test = false;
			if(jQuery(".return-to-quote",contextID).length > 0) {
				test = jQuery(".return-to-quote",contextID).is(":visible");
			}
			ok(test,"This test will only ever pass on a v11 Homepage.");
		});

		module("Homepage functions: Quickstart 10.");
		test("adding button v10 homepage",function() {
			var context = "v10test";
			var contextID = "#" + context;
			jQuery(test_fixture).append("<div id='" + context +"'>" +
												"<div id='mainnav'>" +
													"<ul/>" +
												"</div>" +
											"</div>");
			rtq.add_button_to_homepage(rtq.v10_homepage_callback,contextID);
			ok(jQuery("#rtq_li",contextID).length > 0, "This button will only ever pass on a v10 and below Homepage.");
		});

		var id = document.getElementsByName("id")[0];
		if(id) {
			module("Will ONLY pass when viewing a quote");
			test("Cookie has been set",function() {
				rtq.set_cookie_in_commerce();

				var cook = jQuery.cookie("last_transaction");
				var test = cook.indexOf(id.value) > 0;
				ok(test, "Cookie contains this quote's BS_ID");
			});
		}
	}
	
	return tests;
});
