/**
 * BigMachines standard JS Module loading
 */
(function() {
  function include_homepage_js() {
    var sitename = _BM_HOST_COMPANY;

    if(sitename !== undefined) {
      var script_tag = document.createElement("script");
      script_tag.setAttribute("src","/bmfsweb/"+sitename+"/image/javascript/require.js");
      script_tag.setAttribute("data-main","homepage");
      script_tag.setAttribute("type","text/javascript");

      document.getElementsByTagName("head")[0].appendChild(script_tag);
    }
  }

  include_homepage_js();
}());
