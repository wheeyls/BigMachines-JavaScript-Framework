require.ready(function() {
	// some stuff
	require(["jquery"],function($) {
		console.info("inside module, version of $ is: " + $.fn.jquery);
	});
});