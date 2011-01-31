 /**
  * @namespace
  *
  * @name commerce_ids
  * @description A module used to grab common ids out of the source of a BigMachines quote
  **/
define(function() {
  var commerce_ids = {};

  /**
   * Grab a hash of common ids
   *
   * @return ids {Object}
   * @return ids.document_id {String}
   * @return ids.open_action_id {String}
   * @return ids.version_id {String}
   * @return ids.document_number {String}
   * @return ids.bsid {String}
   */
  commerce_ids.get_ids = function() {
    return {
		  document_id: document.getElementsByName("document_id")[0].value,
		  open_action_id: "4654396",
		  version_id: document.getElementsByName("version_id")[0].value,
		  document_number: "-1",
		  bsid: document.getElementsByName("id")[0].value
    };
	}

  return commerce_ids;
});
