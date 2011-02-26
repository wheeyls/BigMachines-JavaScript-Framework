/**
* @version 02/25/2011
*/
define(["copy_value"],function(cpv) {
	var tests = {};
	
	function jQuerySelectByName(tag,name) {
		return tag + "[name='" + name + "']";
	}
	
	tests.run_tests = function(test_fixture) {
		module("copy_value");
		test("combobox",function() {
			var combobox = "combobox1";
			var text = "textfield1";
			jQuery(test_fixture).append(
				"<select name='" + combobox + "'>" +
					"<option value='option1' selected>Option 1</option>" +
					"<option value='option2'>Option 2</option>" + 
				"</select>"
				);
			jQuery(test_fixture).append(
				"<input type='hidden' name='" + text + "' value='target text'/>"
				);
			cpv.copy_value(combobox,text,test_fixture);
			ok(jQuery(jQuerySelectByName("select",combobox)).val() === jQuery(jQuerySelectByName("input",text)).val(),"combobox element should match text field");
		});
		test("field",function() {
			var textfield = "textfield";
			var text = "textfield1";
			jQuery(test_fixture).append(
				"<input type='text' name='" + textfield + "' value='source text'/>"
				);
			jQuery(test_fixture).append(
				"<input type='hidden' name='" + text + "' value='target text'/>"
				);
			cpv.copy_value(textfield,text,test_fixture);
			ok(jQuery(jQuerySelectByName("input",textfield)).val() === jQuery(jQuerySelectByName("input",text)).val(),"text field should match text field");
		});
	}
	
	return tests;
});