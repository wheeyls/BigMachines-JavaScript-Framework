require.ready(function() {
	// some stuff
	require(["jquery-loader"],function($) {
		console.info("inside module, version of $ is: " + $.fn.jquery);
	});
});
