require(["with-jquery"],function(with_jquery) {
	require.ready(function() {
		with_jquery.with_jquery(function() {
			jQuery("body").append("<p>hi from jq-main! Version is: " + jQuery.fn.jquery + "</p>");
			require(["jq-inner"],function(jq_inner) {
				jq_inner.test();
			});
		});
	});
});