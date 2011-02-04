require(["with-jquery"],function(with_jquery) {
	require.ready(function() {
		with_jquery.with_jquery(function() {
			jQuery("#jq_div").append("hi from jq-main! Version is: " + jQuery.fn.jquery + "<br/>");
			require(["jq-inner"],function(jq_inner) {
				jq_inner.test();
			});
		});
	});
});