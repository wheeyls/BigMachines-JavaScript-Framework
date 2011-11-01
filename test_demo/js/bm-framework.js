/**
 * The BigMachines JavaScript Framework
 * @version Mon Sep 19 15:39:20 2011
 **/
var requirejs, require, define;
(function() { 
		var setup = {}, initiate_require, bootstrap;
		/**
		 * This is the setup section of the BigMachines JavaScript Framework.
		 * Set "active" to true for any pages that you want to customize with Javascript
		 * Then write your code in the corresponding file in the File Manager
		 *
		 * For instance, if I set homepage:true then I can write my code in homepage.js
		 *
		 * Put other files that you want to have available on each page in the "preload" array.
		 * For instance, if you want to preload "jquery_cookie.js" then put:
		 * preload:["jquery_cookie"]
		 * 
		 * 
		 */
		setup.pages = {
			homepage: {
				active:true, 
				preload:["return_to_quote_button", "jquery_cookie", "qs_homepage"]
			},
			commerce: {
				active:true, 
				preload:["return_to_quote_button", "jquery_cookie", "commerce_ids"]
			},
			commerce_line: {	
				active:false,
				preload:[]
			},
			config: {
				active:false, 
				preload:[]
			},
			sitewide: {
				active:false, 
				preload:[]
			}
		};
	
	/**
	 * Support Code Starts here. Do not edit below this line.
	 **/
	initiate_require = function() {
		/*
		 RequireJS 1.0.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
		 Available via the MIT or new BSD license.
		 see: http://github.com/jrburke/requirejs for details
		*/
		// PATCH by Michael Wheeler. These variables will be mapped globally.
		// var requirejs, require, define;
		// END PATCH
		(function(){function J(b){return M.call(b)==="[object Function]"}function E(b){return M.call(b)==="[object Array]"}function Z(b,c,i){for(var j in c)if(!(j in K)&&(!(j in b)||i))b[j]=c[j];return d}function N(b,c,d){b=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);if(d)b.originalError=d;return b}function $(b,c,d){var j,l,q;for(j=0;q=c[j];j++){q=typeof q==="string"?{name:q}:q;l=q.location;if(d&&(!l||l.indexOf("/")!==0&&l.indexOf(":")===-1))l=d+"/"+(l||q.name);b[q.name]={name:q.name,location:l||
		q.name,main:(q.main||"main").replace(da,"").replace(aa,"")}}}function V(b,c){b.holdReady?b.holdReady(c):c?b.readyWait+=1:b.ready(!0)}function ea(b){function c(a,h){var e,s;if(a&&a.charAt(0)==="."&&h){p.pkgs[h]?h=[h]:(h=h.split("/"),h=h.slice(0,h.length-1));e=a=h.concat(a.split("/"));var b;for(s=0;b=e[s];s++)if(b===".")e.splice(s,1),s-=1;else if(b==="..")if(s===1&&(e[2]===".."||e[0]===".."))break;else s>0&&(e.splice(s-1,2),s-=2);s=p.pkgs[e=a[0]];a=a.join("/");s&&a===e+"/"+s.main&&(a=e)}return a}function i(a,
		h){var e=a?a.indexOf("!"):-1,b=null,d=h?h.name:null,f=a,k,i;e!==-1&&(b=a.substring(0,e),a=a.substring(e+1,a.length));b&&(b=c(b,d));a&&(b?k=(e=n[b])&&e.normalize?e.normalize(a,function(a){return c(a,d)}):c(a,d):(k=c(a,d),i=E[k],i||(i=g.nameToUrl(k,null,h),E[k]=i)));return{prefix:b,name:k,parentMap:h,url:i,originalName:f,fullName:b?b+"!"+(k||""):k}}function j(){var a=!0,h=p.priorityWait,e,b;if(h){for(b=0;e=h[b];b++)if(!t[e]){a=!1;break}a&&delete p.priorityWait}return a}function l(a,h,e){return function(){var b=
		ga.call(arguments,0),c;if(e&&J(c=b[b.length-1]))c.__requireJsBuild=!0;b.push(h);return a.apply(null,b)}}function q(a,h){var e=l(g.require,a,h);Z(e,{nameToUrl:l(g.nameToUrl,a),toUrl:l(g.toUrl,a),defined:l(g.requireDefined,a),specified:l(g.requireSpecified,a),isBrowser:d.isBrowser});return e}function o(a){var h,e,b;b=a.callback;var c=a.map,f=c.fullName,k=a.deps,fa=a.listeners;if(b&&J(b)){if(p.catchError.define)try{e=d.execCb(f,a.callback,k,n[f])}catch(j){h=j}else e=d.execCb(f,a.callback,k,n[f]);if(f)a.cjsModule&&
		a.cjsModule.exports!==void 0?e=n[f]=a.cjsModule.exports:e===void 0&&a.usingExports?e=n[f]:(n[f]=e,F[f]&&(Q[f]=!0))}else f&&(e=n[f]=b,F[f]&&(Q[f]=!0));if(D[a.id])delete D[a.id],a.isDone=!0,g.waitCount-=1,g.waitCount===0&&(I=[]);delete R[f];if(d.onResourceLoad&&!a.placeholder)d.onResourceLoad(g,c,a.depArray);if(h)return e=(f?i(f).url:"")||h.fileName||h.sourceURL,b=h.moduleTree,h=N("defineerror",'Error evaluating module "'+f+'" at location "'+e+'":\n'+h+"\nfileName:"+e+"\nlineNumber: "+(h.lineNumber||
		h.line),h),h.moduleName=f,h.moduleTree=b,d.onError(h);for(h=0;b=fa[h];h++)b(e)}function r(a,h){return function(b){a.depDone[h]||(a.depDone[h]=!0,a.deps[h]=b,a.depCount-=1,a.depCount||o(a))}}function v(a,h){var b=h.map,c=b.fullName,i=b.name,f=L[a]||(L[a]=n[a]),k;if(!h.loading)h.loading=!0,k=function(a){h.callback=function(){return a};o(h);t[h.id]=!0;x()},k.fromText=function(a,h){var b=O;t[a]=!1;g.scriptCount+=1;g.fake[a]=!0;b&&(O=!1);d.exec(h);b&&(O=!0);g.completeLoad(a)},c in n?k(n[c]):f.load(i,q(b.parentMap,
		!0),k,p)}function w(a){D[a.id]||(D[a.id]=a,I.push(a),g.waitCount+=1)}function C(a){this.listeners.push(a)}function u(a,b){var e=a.fullName,c=a.prefix,d=c?L[c]||(L[c]=n[c]):null,f,k;e&&(f=R[e]);if(!f&&(k=!0,f={id:(c&&!d?M++ +"__p@:":"")+(e||"__r@"+M++),map:a,depCount:0,depDone:[],depCallbacks:[],deps:[],listeners:[],add:C},z[f.id]=!0,e&&(!c||L[c])))R[e]=f;c&&!d?(e=u(i(c),!0),e.add(function(){var b=i(a.originalName,a.parentMap),b=u(b,!0);f.placeholder=!0;b.add(function(a){f.callback=function(){return a};
		o(f)})})):k&&b&&(t[f.id]=!1,g.paused.push(f),w(f));return f}function y(a,b,e,c){var a=i(a,c),d=a.name,f=a.fullName,k=u(a),j=k.id,l=k.deps,m;if(f){if(f in n||t[j]===!0||f==="jquery"&&p.jQuery&&p.jQuery!==e().fn.jquery)return;z[j]=!0;t[j]=!0;f==="jquery"&&e&&S(e())}k.depArray=b;k.callback=e;for(e=0;e<b.length;e++)if(j=b[e])j=i(j,d?a:c),m=j.fullName,b[e]=m,m==="require"?l[e]=q(a):m==="exports"?(l[e]=n[f]={},k.usingExports=!0):m==="module"?k.cjsModule=l[e]={id:d,uri:d?g.nameToUrl(d,null,c):void 0,exports:n[f]}:
		m in n&&!(m in D)&&(!(f in F)||f in F&&Q[m])?l[e]=n[m]:(f in F&&(F[m]=!0,delete n[m],T[j.url]=!1),k.depCount+=1,k.depCallbacks[e]=r(k,e),u(j,!0).add(k.depCallbacks[e]));k.depCount?w(k):o(k)}function m(a){y.apply(null,a)}function A(a,b){if(!a.isDone){var e=a.map.fullName,c=a.depArray,d,f,g,j;if(e){if(b[e])return n[e];b[e]=!0}if(c)for(d=0;d<c.length;d++)if(f=c[d])if((g=i(f).prefix)&&(j=D[g])&&A(j,b),(g=D[f])&&!g.isDone&&t[f])f=A(g,b),a.depCallbacks[d](f);return e?n[e]:void 0}}function B(){var a=p.waitSeconds*
		1E3,b=a&&g.startTime+a<(new Date).getTime(),a="",e=!1,c=!1,i;if(!(g.pausedCount>0)){if(p.priorityWait)if(j())x();else return;for(i in t)if(!(i in K)&&(e=!0,!t[i]))if(b)a+=i+" ";else{c=!0;break}if(e||g.waitCount){if(b&&a)return i=N("timeout","Load timeout for modules: "+a),i.requireType="timeout",i.requireModules=a,d.onError(i);if(c||g.scriptCount){if((G||ba)&&!W)W=setTimeout(function(){W=0;B()},50)}else{if(g.waitCount){for(H=0;a=I[H];H++)A(a,{});g.paused.length&&x();X<5&&(X+=1,B())}X=0;d.checkReadyState()}}}}
		var g,x,p={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},catchError:{}},P=[],z={require:!0,exports:!0,module:!0},E={},n={},t={},D={},I=[],T={},M=0,R={},L={},F={},Q={},Y=0;S=function(a){if(!g.jQuery&&(a=a||(typeof jQuery!=="undefined"?jQuery:null))&&!(p.jQuery&&a.fn.jquery!==p.jQuery)&&("holdReady"in a||"readyWait"in a))if(g.jQuery=a,m(["jquery",[],function(){return jQuery}]),g.scriptCount)V(a,!0),g.jQueryIncremented=!0};x=function(){var a,b,e,c,i,f;Y+=1;if(g.scriptCount<=0)g.scriptCount=0;for(;P.length;)if(a=
		P.shift(),a[0]===null)return d.onError(N("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));else m(a);if(!p.priorityWait||j())for(;g.paused.length;){i=g.paused;g.pausedCount+=i.length;g.paused=[];for(c=0;a=i[c];c++)b=a.map,e=b.url,f=b.fullName,b.prefix?v(b.prefix,a):!T[e]&&!t[f]&&(d.load(g,f,e),T[e]=!0);g.startTime=(new Date).getTime();g.pausedCount-=i.length}Y===1&&B();Y-=1};g={contextName:b,config:p,defQueue:P,waiting:D,waitCount:0,specified:z,loaded:t,urlMap:E,urlFetched:T,scriptCount:0,
		defined:n,paused:[],pausedCount:0,plugins:L,needFullExec:F,fake:{},fullExec:Q,managerCallbacks:R,makeModuleMap:i,normalize:c,configure:function(a){var b,e,c;a.baseUrl&&a.baseUrl.charAt(a.baseUrl.length-1)!=="/"&&(a.baseUrl+="/");b=p.paths;c=p.pkgs;Z(p,a,!0);if(a.paths){for(e in a.paths)e in K||(b[e]=a.paths[e]);p.paths=b}if((b=a.packagePaths)||a.packages){if(b)for(e in b)e in K||$(c,b[e],e);a.packages&&$(c,a.packages);p.pkgs=c}if(a.priority)e=g.requireWait,g.requireWait=!1,g.takeGlobalQueue(),x(),
		g.require(a.priority),x(),g.requireWait=e,p.priorityWait=a.priority;if(a.deps||a.callback)g.require(a.deps||[],a.callback)},requireDefined:function(a,b){return i(a,b).fullName in n},requireSpecified:function(a,b){return i(a,b).fullName in z},require:function(a,c,e){if(typeof a==="string"){if(J(c))return d.onError(N("requireargs","Invalid require call"));if(d.get)return d.get(g,a,c);c=i(a,c);a=c.fullName;return!(a in n)?d.onError(N("notloaded","Module name '"+c.fullName+"' has not been loaded yet for context: "+
		b)):n[a]}(a&&a.length||c)&&y(null,a,c,e);if(!g.requireWait)for(;!g.scriptCount&&g.paused.length;)g.takeGlobalQueue(),x();return g.require},takeGlobalQueue:function(){U.length&&(ha.apply(g.defQueue,[g.defQueue.length-1,0].concat(U)),U=[])},completeLoad:function(a){var b;for(g.takeGlobalQueue();P.length;)if(b=P.shift(),b[0]===null){b[0]=a;break}else if(b[0]===a)break;else m(b),b=null;b?m(b):m([a,[],a==="jquery"&&typeof jQuery!=="undefined"?function(){return jQuery}:null]);S();d.isAsync&&(g.scriptCount-=
		1);x();d.isAsync||(g.scriptCount-=1)},toUrl:function(a,b){var c=a.lastIndexOf("."),d=null;c!==-1&&(d=a.substring(c,a.length),a=a.substring(0,c));return g.nameToUrl(a,d,b)},nameToUrl:function(a,b,e){var i,j,f,k,l=g.config,a=c(a,e&&e.fullName);if(d.jsExtRegExp.test(a))b=a+(b?b:"");else{i=l.paths;j=l.pkgs;e=a.split("/");for(k=e.length;k>0;k--)if(f=e.slice(0,k).join("/"),i[f]){e.splice(0,k,i[f]);break}else if(f=j[f]){a=a===f.name?f.location+"/"+f.main:f.location;e.splice(0,k,a);break}b=e.join("/")+(b||
		".js");b=(b.charAt(0)==="/"||b.match(/^\w+:/)?"":l.baseUrl)+b}return l.urlArgs?b+((b.indexOf("?")===-1?"?":"&")+l.urlArgs):b}};g.jQueryCheck=S;g.resume=x;return g}function ia(){var b,c,d;if(m&&m.readyState==="interactive")return m;b=document.getElementsByTagName("script");for(c=b.length-1;c>-1&&(d=b[c]);c--)if(d.readyState==="interactive")return m=d;return null}var ja=/(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,ka=/require\(\s*["']([^'"\s]+)["']\s*\)/g,da=/^\.\//,aa=/\.js$/,M=Object.prototype.toString,r=Array.prototype,
		ga=r.slice,ha=r.splice,G=!!(typeof window!=="undefined"&&navigator&&document),ba=!G&&typeof importScripts!=="undefined",la=G&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,ca=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",K={},u={},U=[],m=null,X=0,O=!1,d,r={},I,w,y,z,v,A,B,H,C,S,W;if(typeof define==="undefined"){if(typeof requirejs!=="undefined")if(J(requirejs))return;else r=requirejs,requirejs=void 0;typeof require!=="undefined"&&!J(require)&&(r=require,
		require=void 0);d=requirejs=function(b,c,d){var j="_",l;!E(b)&&typeof b!=="string"&&(l=b,E(c)?(b=c,c=d):b=[]);if(l&&l.context)j=l.context;d=u[j]||(u[j]=ea(j));l&&d.configure(l);return d.require(b,c)};d.config=function(b){return d(b)};require||(require=d);d.toUrl=function(b){return u._.toUrl(b)};d.version="1.0.0";d.jsExtRegExp=/^\/|:|\?|\.js$/;w=d.s={contexts:u,skipAsync:{}};if(d.isAsync=d.isBrowser=G)if(y=w.head=document.getElementsByTagName("head")[0],z=document.getElementsByTagName("base")[0])y=
		w.head=z.parentNode;d.onError=function(b){throw b;};d.load=function(b,c,i){d.resourcesReady(!1);b.scriptCount+=1;d.attach(i,b,c);if(b.jQuery&&!b.jQueryIncremented)V(b.jQuery,!0),b.jQueryIncremented=!0};define=function(b,c,d){var j,l;typeof b!=="string"&&(d=c,c=b,b=null);E(c)||(d=c,c=[]);!c.length&&J(d)&&d.length&&(d.toString().replace(ja,"").replace(ka,function(b,d){c.push(d)}),c=(d.length===1?["require"]:["require","exports","module"]).concat(c));if(O&&(j=I||ia()))b||(b=j.getAttribute("data-requiremodule")),
		l=u[j.getAttribute("data-requirecontext")];(l?l.defQueue:U).push([b,c,d])};define.amd={multiversion:!0,plugins:!0,jQuery:!0};d.exec=function(b){return eval(b)};d.execCb=function(b,c,d,j){return c.apply(j,d)};d.addScriptToDom=function(b){I=b;z?y.insertBefore(b,z):y.appendChild(b);I=null};d.onScriptLoad=function(b){var c=b.currentTarget||b.srcElement,i;if(b.type==="load"||c&&la.test(c.readyState))m=null,b=c.getAttribute("data-requirecontext"),i=c.getAttribute("data-requiremodule"),u[b].completeLoad(i),
		c.detachEvent&&!ca?c.detachEvent("onreadystatechange",d.onScriptLoad):c.removeEventListener("load",d.onScriptLoad,!1)};d.attach=function(b,c,i,j,l,m){var o;if(G)return j=j||d.onScriptLoad,o=c&&c.config&&c.config.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),o.type=l||"text/javascript",o.charset="utf-8",o.async=!w.skipAsync[b],c&&o.setAttribute("data-requirecontext",c.contextName),o.setAttribute("data-requiremodule",i),o.attachEvent&&
		!ca?(O=!0,m?o.onreadystatechange=function(){if(o.readyState==="loaded")o.onreadystatechange=null,o.attachEvent("onreadystatechange",j),m(o)}:o.attachEvent("onreadystatechange",j)):o.addEventListener("load",j,!1),o.src=b,m||d.addScriptToDom(o),o;else ba&&(importScripts(b),c.completeLoad(i));return null};if(G){v=document.getElementsByTagName("script");for(H=v.length-1;H>-1&&(A=v[H]);H--){if(!y)y=A.parentNode;if(B=A.getAttribute("data-main")){if(!r.baseUrl)v=B.split("/"),A=v.pop(),v=v.length?v.join("/")+
		"/":"./",r.baseUrl=v,B=A.replace(aa,"");r.deps=r.deps?r.deps.concat(B):[B];break}}}d.checkReadyState=function(){var b=w.contexts,c;for(c in b)if(!(c in K)&&b[c].waitCount)return;d.resourcesReady(!0)};d.resourcesReady=function(b){var c,i;d.resourcesDone=b;if(d.resourcesDone)for(i in b=w.contexts,b)if(!(i in K)&&(c=b[i],c.jQueryIncremented))V(c.jQuery,!1),c.jQueryIncremented=!1};d.pageLoaded=function(){if(document.readyState!=="complete")document.readyState="complete"};if(G&&document.addEventListener&&
		!document.readyState)document.readyState="loading",window.addEventListener("load",d.pageLoaded,!1);d(r);if(d.isAsync&&typeof setTimeout!=="undefined")C=w.contexts[r.context||"_"],C.requireWait=!0,setTimeout(function(){C.requireWait=!1;C.takeGlobalQueue();C.jQueryCheck();C.scriptCount||C.resume();d.checkReadyState()},0)}})();

		/*
		 RequireJS domReady 1.0.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
		 Available via the MIT or new BSD license.
		 see: http://github.com/jrburke/requirejs for details
		*/
		//PATCH Mike Wheeler - context pattern vs define
		// Composure changeset - on quickstartdev.bigmachines.com: http://firefox.bigmachines.com/repo/records/3283/10
		//define(
		!function(that){function k(a){for(var b=0,c;c=a[b];b++)c(f)}function l(){var a=g,b=h;c&&(a.length&&(g=[],k(a)),d.resourcesDone&&b.length&&(h=[],k(b)))}function e(){c||(c=!0,i&&clearInterval(i),l())}function b(a){c?a(f):g.push(a);return b}var j=typeof window!=="undefined"&&window.document,c=!j,f=j?document:null,g=[],h=[],d=requirejs||require||{},m=d.resourcesReady,i;if("resourcesReady"in d)d.resourcesReady=function(a){m&&m(a);a&&l()};j&&(document.addEventListener?(document.addEventListener("DOMContentLoaded",
		e,!1),window.addEventListener("load",e,!1)):window.attachEvent&&(window.attachEvent("onload",e),self===self.top&&(i=setInterval(function(){try{document.body&&(document.documentElement.doScroll("left"),e())}catch(a){}},30))),document.readyState==="complete"&&e());b.withResources=function(a){c&&d.resourcesDone?a(f):h.push(a);return b};b.version="1.0.0";b.load=function(a,c,d,e){e.isBuild?d(null):b(d)};that.ready=b}(require);
		//);
	};
	/**
	 * The Bootstrap, by Michael Wheeler
	 * Loads up sections of code based on:
	 *  - The active pages in setup
	 *  - Which page is currently being viewed in BigMachines
	 **/
	bootstrap = function() {
		var me = {}, ps = {}, log = {}, debug = false;

		if(!setup) {return;}

		if(typeof _BM_HOST_COMPANY !== "string") { 
			throw new Error("BigMachines Framework Critical Error. Can't determine the path to the file manager for this site, because _BM_HOST_COMPANY is not available.");
		}

		require.config({
			baseUrl: "/bmfsweb/" + _BM_HOST_COMPANY + "/image/javascript", 
			waitSeconds: 15
		}); 

		me.window_url = document.location.href;

		/**
		 * Bare-bones, fast publish/subscribe
		 **/
		ps.functions = {};
		ps.sub = function(topic, callback) {
			if(!ps.functions[topic]) {
				ps.functions[topic] = [];
			}
			ps.functions[topic].push(callback);
		};
		ps.pub = function(topic, args) {
			var i, ii, funcs = ps.functions[topic];

			if(!funcs) {return;}

			if(debug) { log[topic] = log[topic]+1 || 1; }
			
			for(i = 0, ii = funcs.length; i<ii; i++) {
				funcs[i].apply(this, args || []);
			}
		};
		ps.clear = function(topic) {
			if(!topic) { 
				ps.functions = {};
			} else {
				ps.functions[topic] = [];
			}
		};
		/**
		 * End pub sub
		 */

		/**
		 * This function allows us to add details to the setup
		 **/
		setup.extend = function(name, add) {
			var i, root;
			root = setup.pages[name];
			//don't spend time on inactive pages
			if(!root || !root.active) {return;}
			for(i in add) {
				if(!add.hasOwnProperty(i)) {return;}
				root[i] = add[i];
			}
		}
		/**
		 * The pages object is used to identify which page is being viewed
		 **/
		setup.extend("sitewide", {
			always: true
		});
		setup.extend("commerce", {
			url_regex: ["/commerce/buyside/document.jsp"],
			match: function() {
				var doc_form_exists;
				if(typeof jQuery !==  "function") {return false;}

				doc_form_exists = jQuery("form[name='bmDocForm']").length > 0;
				if(doc_form_exists) {
					return me.get_doc_number() === 1;
				}
				
				return false;
			}
		});
		setup.extend("commerce_line", {
			url_regex: ["/commerce/buyside/document.jsp"],
			match: function() {
				var doc_form_exists;
				if(typeof jQuery !==  "function") {return false;}

				doc_form_exists = jQuery("form[name='bmDocForm']").length > 0;
				if(doc_form_exists) {
					return me.get_doc_number() > 1;
				}
			
				return false;
			}
		});
		setup.extend("config", {
			url_regex:["/model_configs.jsp"],
			match: function() {
				return true;
			}
		});
		setup.extend("homepage", {
			url_regex: ["commerce/display_company_profile.jsp", "/commerce/buyside/document.jsp"],
			match: function() {
				//requires a custom variable in the alt-homepage js
				if(window["bm-framework/is-homepage"]) {return true;}
				if(typeof jQuery !==  "function") {return false;}

				if(me.window_url.search("commerce/display_company_profile.jsp") > -1) {
					return true;
				}
				
				//last and slowest check
				return jQuery("form[name='homePageForm']").length > 0;
			}
		});

	
		me.run= function(name) {
			var files = [name], page = setup.pages[name];
			if(page.preload) {
				files = files.concat(page.preload);
			}
			require(files);
		};
		me.get_doc_number= function() {
			var number = jQuery("input[name='_document_number']").val();
			number = parseInt(number);

			//only perform the DOM crawl once per page
			if(number) {
				me.get_doc_number = function() { return number; }
			}

			return number;
		}

		me.test_regex = function(page) {
			var i, ii, regex = page.url_regex || [];
			if(regex.length === 0) {return true;}

			for(i = 0, ii = regex.length; i<ii; i++) {
				if(me.window_url.search(regex[i]) > -1) {
					return true;
				}
			}

			return false;
		}

		me.test_match = function(page) {
			var test = page.match || function() {return true;}

			return test();
		}

		me.search_for = function(name, page) {
			//don't check for sitewide code
			if(page.always === true) {
				me.run(name);
				return;
			}

			// filter on URL before starting
			if(me.test_regex(page) !== true) {return;}

			//add to queue of searches to be performed
			ps.sub("searches", function() {
				if(me.test_match(page)) {
					ps.pub("found-match", [name]);
				};
			});
		}

		me.show_log = function() {				
			var key, res="", div;
			for(key in log) {
				res += key + ": " + log[key]+"; ";
			}
					
			div = document.createElement("div");
			div.style.position = "absolute"; div.style.top = "100"; div.style.left = "10";div.style.color="red";
			div.innerHTML = "bm-framework.js log results:("+res+")";
			document.body.appendChild(div);
		}

		/**
		 * The magic starts here.
		 */
		me.begin = function() {
			var i, curr_page, 
				delay = setup.delay || 50, 
				timeout = setup.timeout || 5000,
				testees=setup.pages || [];

			ps.sub("found-match", function(name) {
				ps.clear("searches");
				me.run(name);
				if(debug) { log["page"] = name; }
			});

			ps.sub("search-timeout", function() {
				ps.clear("searches");
			});
			window.setTimeout(function() {ps.pub("search-timeout");}, timeout);

			for(i in testees) {
				if(testees[i].active !== true) {continue;}
				curr_page = setup.pages[i];
				if(!curr_page) {
					throw new Error("Problem initiating BigMachines JavaScript framework. File "+ i + " has not been configured.");
				}

				me.search_for(i, curr_page);
			}

			//this function will fire over and over until the searches are cleared
			function poll_searches() {
				var search_topic = ps.functions["searches"];

				if(search_topic && search_topic.length > 0) {
					ps.pub("searches");

					window.setTimeout(poll_searches, delay);
				}
			}
			poll_searches();
		}

		me.begin();
		require.ready(function() {
			if(debug) { me.show_log(); }
		});
		window.setupp = setup;
	};
	
	//only load if there is an active page
	(function() {
		var i, go = false;
		for(i in setup.pages) {
			if(setup.pages[i].active === true){go=true;break;}
		}
		if(go) {initiate_require();bootstrap();}
	}());
}());
