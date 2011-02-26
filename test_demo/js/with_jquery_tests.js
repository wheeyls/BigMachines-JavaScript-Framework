/**
* @version 02/25/2011
*/
define(["with_jquery","qunit"],function(wjq) {
	var tests = {};
	
	// because we are testing multiple global scripts we need a little delay
	var delay = 500;
	
	tests.run_tests = function(fixture) {
		module("with_jquery");
		
		// qunit requires jQuery to work???
		wjq([],function() {
			test("no jquery should have version 1.5",function() {
				var jqVersion = jQuery.fn.jquery;
				ok(jqVersion === "1.5","jQuery version: " + jqVersion);
				setTimeout(testjq,delay);
			});
		});
		
		function testjq() {
			require(["jquery-1.4.2.min"],function() {
				test("jQuery should be unaffected",function() {
					var $Version = $.fn.jquery;
					var jqVersion = jQuery.fn.jquery;
					wjq([],function() {
						var inner$Version = $.fn.jquery;
						ok(inner$Version === $Version,"$ version: " + inner$Version);
						var innerjqVersion = jQuery.fn.jquery;
						ok(innerjqVersion === jqVersion,"jQuery version: " + innerjqVersion);
						setTimeout(testproto,delay);
					});
				});
			});
		}
		
		function testproto() {
			require(["prototype"],function() {
				test("Prototype ($) should not be affected",function() {
					var protoVersion = $.Version;
					wjq([],function() {
						ok($.Version === protoVersion,"$ version: " + $.Version);
					});	
				});
			});
		}
	}
	
	return tests;
});