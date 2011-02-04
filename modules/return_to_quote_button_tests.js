define(["jquery","return_to_quote_button", "commerce_ids", "jquery_cookie"],function($,rtq,ids) {
	var tests = {};
	
	tests.run_tests = function() {
		module("Homepage functions: Quickstart 11.");
		test("adding button v11 homepage",function() {
			//rtq.add_button_to_homepage();
			var test = false;
			if($(".return-to-quote").length > 0) {
				test = $(".return-to-quote").is(":visible");
			}
			ok(test,"This test will only ever pass on a v11 Homepage.");
		});

		module("Homepage functions: Quickstart 10.");
		test("adding button v10 homepage",function() {
			//rtq.add_button_to_homepage(rtq.v10_homepage_callback);
			ok($("#rtq_li").length > 0, "This button will only ever pass on a v10 and below Homepage.");
		});


		module("Will ONLY pass when viewing a quote");
		test("Cookie has been set",function() {
			rtq.set_cookie_in_commerce();

			var cook = $.cookie("last_transaction");

			var id = document.getElementsByName("id")[0].value

			var test = cook.indexOf(id) > 0;

			ok(test, "Cookie contains this quote's BS_ID");
		});
	}
	
	return tests;
});
