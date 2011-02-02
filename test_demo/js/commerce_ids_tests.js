define(["commerce_ids"],function(c_ids) {
	var tests = {};
	
	tests.run_tests = function() {
		module("commerce_ids");
		
		function test_ids() {
			var ids = c_ids.get_ids();
			ok(ids.document_id != null,"document_id is null!");
			ok(ids.open_action_id != null,"open_action_id is null!");
			ok(ids.version_id != null,"version_id is null!");
			ok(ids.document_number != null,"document_number is null!");
			ok(ids.bsid != null,"bsid is null!");
		}
		
		test("ids from page",function() {
			test_ids();
		});
		
		test("id from fixture",function() {
			jQuery("body").append("<div id='commerce_ids_test'>" +
								"<input type='hidden' name='document_id' value='1'/>" +
								"<input type='hidden' name='version_id' value='2'/>" +
								"<input type='hidden' name='id' value='3'/>" +
							"</div>");
			test_ids();
			jQuery("#commerce_ids_test").remove();
		});
	}
	
	return tests;
});