/**
* @namespace
*
* @name return_to_quote_button
* @description A module to add a "Return To Quote" button on the homepage, based on a recent quote.
*
* @requires manager
* @requires jquery.cookie
**/
define(["manager","logger","jquery.cookie"], function(mgr,logger) {
	mgr.register("return_to_quote_button");
	var return_to_quote_button = {};

	/**
	* Called from homepage. Shows a return to quote button on the page, contingent
	* on a cookie created by set_cookie_in_commerce.
	* 
	* Works out of the box with Quickstart Version 11. With older versions, you have to include a callback
	* to build the element for you.
	*
	* @memberOf return_to_quote_button
	* @param callback(urlToQuote) {Function} Optional. If included, then this callback will be called instead of showing the default return to quote element
	*/
	return_to_quote_button.add_button_to_homepage = function(callback,context) {
		logger.debug("adding button to homepage");
		context = context || document;
		var last_trans_cookie = jQuery.cookie("last_transaction");
		//if cookie is set add functionality to link
		if( last_trans_cookie !== null && last_trans_cookie !== "" && last_trans_cookie !== "-1" ) {
			var url = '/commerce/buyside/document.jsp?formaction=performAction&';
			url += last_trans_cookie;

			//version 11 default behavior
			if(typeof callback !== "function") {
				logger.debug("using v11 behavior");
				jQuery(".return-to-quote",context).attr("href", url);
				jQuery(".return-to-quote",context).show();
				
				//parts search doesn't exist (this class is set condtionally in xsl)
				if(jQuery(".return-to-quote-wrapper",context).length){
					jQuery(".return-to-quote-wrapper",context).show();
				}
				else{ //parts search exists
					jQuery(".return-to-quote-pipe",context).show();
				}
			} else {
				callback(url,context);
			}
		}
	};


	/**
	* Called from commerce. Sets a cookie used to Return to Quote from homepage.
	* @memberOf return_to_quote_button
	* @requires commerce_ids
	*/
	return_to_quote_button.set_cookie_in_commerce = function() {
		require(["commerce_ids"],function(c_ids) {
			//get ids off page
			var ids = c_ids.get_ids();
			//builds url
			var last_transaction = '&document_id=' + ids.document_id;
			last_transaction += '&action_id=' + ids.open_action_id;
			last_transaction += '&version_id=' + ids.version_id;
			last_transaction += '&document_number=' + ids.document_number;
			last_transaction += '&id=' + ids.bsid;
			
			// Check if the last_transaction has an id
			// sets last_transaction cookie if last_transaction var is populated
			if(last_transaction.length !== 0){
				jQuery.cookie("last_transaction",last_transaction, {path: '/'}); 
			}
		});
	};


	/**
	* Callback to be passed into add_button_to_homepage. Creates an element on the page to return to quote.
	* 
	* @example rtq.add_button_to_homepage(rtq.v10_homepage_callback);
	* @memberOf return_to_quote_button
	* @param url {String} The relative url of a quote to be returned to
	*/
	return_to_quote_button.v10_homepage_callback = function(url,context) {
		logger.debug("using v10 behavior");
		context = context || document;
		//we're going to attach it to the mainnav as a list item
		var parent_node = jQuery("#mainnav > ul",context);

		// the return to quote button is a link nested inside an li element with some styling
		var child_node = "<li id='rtq_li'> <a id='rtq_link'href='"+url+"'>";
		child_node += "<span class='hpinner-strip'><span class='hpinner-text'>";
		child_node += "Return to Quote</span></span></a> </li>";

		parent_node.append(child_node);
	};


	return return_to_quote_button;
});
