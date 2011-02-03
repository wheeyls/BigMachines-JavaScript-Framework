/**
* @namespace test_util - helpful features for creating tests
* @name test_util
*/
define(function() {
	var test_util = {};
	
	test_util.generateRandomColor = function() {
		var max = 255;
		var red = Math.floor(Math.random() * max);
		var green = Math.floor(Math.random() * max);
		var blue = Math.floor(Math.random() * max);
		return "rgb(" + red + "," + green + "," + blue + ")";
	}

	/** 
	 * Add a border of the specified {color} to {elem}
	 * @param elem The element to apply the border to
	 * @param color The color of the border
	 */
	test_util.apply_border = function(elem,color) {
		jQuery(elem).css("border","2px solid " + color);
	};

	/** 
	 * Generates a qunit test that verifies that at least one of {elem} exists and applies a border
	 * @param elem The element to apply the border to
	 * @param testName The text used to identify the test
	 * @param color (Optional) The color of the border
	 */
	test_util.border_test = function(elem,testName,color) {
		if(typeof color == "undefined") {
			color = test_util.generateRandomColor();
		}
		var testID = testName.replace(/ /g,"_");
		var elemExists = elem != null && elem.length > 0;
		test("<span style='border: 1px solid " + color + "' id='" + testID + "'>" + testName + "</span>",function() {
			
			if(elem != null) {
				test_util.apply_border(elem,color);
			}
			ok(elemExists,elem.length + " elements found");
		});
		
		// Clicking on the test results will take you to the element in question
		if (elemExists) {
			jQuery("li:has(#" + testID + ") ol","#qunit-tests")
			.live("click", function(){
				require(["jquery.scrollTo-1.4.2-min"], function(){
					var offset = jQuery(elem).offset().top;
					//console.info(testID + " clicked, top: " + offset);
					jQuery.scrollTo(offset);
				});
			});
		}
	};
	
	return test_util;
});