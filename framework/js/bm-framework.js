/**
 * The BigMachines JavaScript Framework v2
 * @version Tue Nov 22 17:17:50 2011
 **/
(function(context) { 
		var setup = {}, initiate_require, bootstrap, repeat_until;
		/**
		 * This is the setup section of the BigMachines JavaScript Framework.
		 * Set "active" to true for any pages that you want to customize with Javascript
		 * Then write your code in the corresponding file in the File Manager
		 *
		 * For instance, if I set homepage:true then I can write my code in homepage.js
		 */
		setup.pages = {
			homepage: {
				active:true
			},
			commerce: {
				active:true
			},
			commerce_line: {	
				active:true
			},
			config: {
				active:true
			},
			sitewide: {
				active:false
			}
		};
	
	/**
	 * Support Code Starts here. Do not edit below this line.
	 **/
	/**
	 * Simple polling. repeat_until(function, delay).and_then(function).timeout(function, time); 
	 */
	(function(context) {
		repeat_until = function(test, delay) {
			var done = false, me,
				success_timer, success_callback, failure_timer, test_result, repeat;

			delay = delay !== undefined ? delay : 20;

			repeat = function() {
				test_result = test();
				if(test_result === false) {
					success_timer = window.setTimeout(repeat, delay);
				} else {
					done = true;
					if(success_callback) {
						success_callback(test_result);
					}
					window.clearTimeout(failure_timer);
				}
			};

			me = {
				and_then: function(success) {
					success_callback = success;
					if(done && test_result !== false) {
						success_callback(test_result);
					}
					return me;
				},
				timeout: function(failure, time) {
					time = time !== undefined ? time : 7000;
					failure_timer = window.setTimeout(function() {
						if(!done) {
							done = true;
							failure();
							window.clearTimeout(success_timer);
						}
					}, time);
					return me;
				}
			};

			repeat();

			return me;
		};
		context.repeat_until = repeat_until;
	}(context));
	/**
	 * Bare-bones, fast publish/subscribe
	 **/
	(function(context) {
		var ps = {};
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

		context.pubsub = ps;
	}(context));
	initiate_require = function(context, bootstrap) {
    var base_url = context.base_url || "/bmfsweb/" + _BM_HOST_COMPANY + "/image/javascript";

    // ====== REQUIRE =====
		/*
		 RequireJS 1.0.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
		 Available via the MIT or new BSD license.
		 see: http://github.com/jrburke/requirejs for details
		*/
    var requirejs,require,define;(function(){function J(a){return M.call(a)==="[object Function]"}function E(a){return M.call(a)==="[object Array]"}function Z(a,b,c){for(var e in b)!(e in K)&&(!(e in a)||c)&&(a[e]=b[e]);return d}function N(a,b,c){return a=Error(b+"\nhttp://requirejs.org/docs/errors.html#"+a),c&&(a.originalError=c),a}function $(a,b,c){var d,e,f;for(d=0;f=b[d];d++)f=typeof f=="string"?{name:f}:f,e=f.location,c&&(!e||e.indexOf("/")!==0&&e.indexOf(":")===-1)&&(e=c+"/"+(e||f.name)),a[f.name]={name:f.name,location:e||f.name,main:(f.main||"main").replace(da,"").replace(aa,"")}}function V(a,b){a.holdReady?a.holdReady(b):b?a.readyWait+=1:a.ready(!0)}function ea(a){function b(a,b){var c,d;if(a&&a.charAt(0)==="."&&b){t.pkgs[b]?b=[b]:(b=b.split("/"),b=b.slice(0,b.length-1)),c=a=b.concat(a.split("/"));var e;for(d=0;e=c[d];d++)if(e===".")c.splice(d,1),d-=1;else if(e==="..")if(d!==1||c[2]!==".."&&c[0]!=="..")d>0&&(c.splice(d-1,2),d-=2);else break;d=t.pkgs[c=a[0]],a=a.join("/"),d&&a===c+"/"+d.main&&(a=c)}return a}function c(a,c){var d=a?a.indexOf("!"):-1,e=null,f=c?c.name:null,g=a,h,i;return d!==-1&&(e=a.substring(0,d),a=a.substring(d+1,a.length)),e&&(e=b(e,f)),a&&(e?h=(d=x[e])&&d.normalize?d.normalize(a,function(a){return b(a,f)}):b(a,f):(h=b(a,f),i=w[h],i||(i=r.nameToUrl(h,null,c),w[h]=i))),{prefix:e,name:h,parentMap:c,url:i,originalName:g,fullName:e?e+"!"+(h||""):h}}function e(){var a=!0,b=t.priorityWait,c,d;if(b){for(d=0;c=b[d];d++)if(!y[c]){a=!1;break}a&&delete t.priorityWait}return a}function f(a,b,c){return function(){var d=ga.call(arguments,0),e;return c&&J(e=d[d.length-1])&&(e.__requireJsBuild=!0),d.push(b),a.apply(null,d)}}function g(a,b){var c=f(r.require,a,b);return Z(c,{nameToUrl:f(r.nameToUrl,a),toUrl:f(r.toUrl,a),defined:f(r.requireDefined,a),specified:f(r.requireSpecified,a),isBrowser:d.isBrowser}),c}function h(a){var b,e,f;f=a.callback;var g=a.map,h=g.fullName,i=a.deps,j=a.listeners;if(f&&J(f)){if(t.catchError.define)try{e=d.execCb(h,a.callback,i,x[h])}catch(k){b=k}else e=d.execCb(h,a.callback,i,x[h]);h&&(a.cjsModule&&a.cjsModule.exports!==void 0?e=x[h]=a.cjsModule.exports:e===void 0&&a.usingExports?e=x[h]:(x[h]=e,F[h]&&(I[h]=!0)))}else h&&(e=x[h]=f,F[h]&&(I[h]=!0));z[a.id]&&(delete z[a.id],a.isDone=!0,r.waitCount-=1,r.waitCount===0&&(A=[])),delete D[h],d.onResourceLoad&&!a.placeholder&&d.onResourceLoad(r,g,a.depArray);if(b)return e=(h?c(h).url:"")||b.fileName||b.sourceURL,f=b.moduleTree,b=N("defineerror",'Error evaluating module "'+h+'" at location "'+e+'":\n'+b+"\nfileName:"+e+"\nlineNumber: "+(b.lineNumber||b.line),b),b.moduleName=h,b.moduleTree=f,d.onError(b);for(b=0;f=j[b];b++)f(e)}function i(a,b){return function(c){a.depDone[b]||(a.depDone[b]=!0,a.deps[b]=c,a.depCount-=1,a.depCount||h(a))}}function j(a,b){var c=b.map,e=c.fullName,f=c.name,i=E[a]||(E[a]=x[a]),j;b.loading||(b.loading=!0,j=function(a){b.callback=function(){return a},h(b),y[b.id]=!0,s()},j.fromText=function(a,b){var c=O;y[a]=!1,r.scriptCount+=1,r.fake[a]=!0,c&&(O=!1),d.exec(b),c&&(O=!0),r.completeLoad(a)},e in x?j(x[e]):i.load(f,g(c.parentMap,!0),j,t))}function k(a){z[a.id]||(z[a.id]=a,A.push(a),r.waitCount+=1)}function l(a){this.listeners.push(a)}function m(a,b){var d=a.fullName,e=a.prefix,f=e?E[e]||(E[e]=x[e]):null,g,i;return d&&(g=D[d]),!g&&(i=!0,g={id:(e&&!f?C++ +"__p@:":"")+(d||"__r@"+C++),map:a,depCount:0,depDone:[],depCallbacks:[],deps:[],listeners:[],add:l},v[g.id]=!0,d&&(!e||E[e]))&&(D[d]=g),e&&!f?(d=m(c(e),!0),d.add(function(){var b=c(a.originalName,a.parentMap),b=m(b,!0);g.placeholder=!0,b.add(function(a){g.callback=function(){return a},h(g)})})):i&&b&&(y[g.id]=!1,r.paused.push(g),k(g)),g}function n(a,b,d,e){var a=c(a,e),f=a.name,j=a.fullName,l=m(a),n=l.id,o=l.deps,p;if(j){if(j in x||y[n]===!0||j==="jquery"&&t.jQuery&&t.jQuery!==d().fn.jquery)return;v[n]=!0,y[n]=!0,j==="jquery"&&d&&S(d())}l.depArray=b,l.callback=d;for(d=0;d<b.length;d++)if(n=b[d])n=c(n,f?a:e),p=n.fullName,b[d]=p,p==="require"?o[d]=g(a):p==="exports"?(o[d]=x[j]={},l.usingExports=!0):p==="module"?l.cjsModule=o[d]={id:f,uri:f?r.nameToUrl(f,null,e):void 0,exports:x[j]}:!(p in x)||p in z||j in F&&!(j in F&&I[p])?(j in F&&(F[p]=!0,delete x[p],B[n.url]=!1),l.depCount+=1,l.depCallbacks[d]=i(l,d),m(n,!0).add(l.depCallbacks[d])):o[d]=x[p];l.depCount?k(l):h(l)}function o(a){n.apply(null,a)}function p(a,b){if(!a.isDone){var d=a.map.fullName,e=a.depArray,f,g,h,i;if(d){if(b[d])return x[d];b[d]=!0}if(e)for(f=0;f<e.length;f++)if(g=e[f])if((h=c(g).prefix)&&(i=z[h])&&p(i,b),(h=z[g])&&!h.isDone&&y[g])g=p(h,b),a.depCallbacks[f](g);return d?x[d]:void 0}}function q(){var a=t.waitSeconds*1e3,b=a&&r.startTime+a<(new Date).getTime(),a="",c=!1,f=!1,g;if(r.pausedCount<=0){if(t.priorityWait)if(e())s();else return;for(g in y)if(!(g in K)&&(c=!0,!y[g]))if(b)a+=g+" ";else{f=!0;break}if(c||r.waitCount){if(b&&a)return g=N("timeout","Load timeout for modules: "+a),g.requireType="timeout",g.requireModules=a,d.onError(g);if(f||r.scriptCount)(G||ba)&&!W&&(W=setTimeout(function(){W=0,q()},50));else{if(r.waitCount){for(H=0;a=A[H];H++)p(a,{});r.paused.length&&s(),X<5&&(X+=1,q())}X=0,d.checkReadyState()}}}}var r,s,t={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},catchError:{}},u=[],v={require:!0,exports:!0,module:!0},w={},x={},y={},z={},A=[],B={},C=0,D={},E={},F={},I={},L=0;return S=function(a){!r.jQuery&&(a=a||(typeof jQuery!="undefined"?jQuery:null))&&(!t.jQuery||a.fn.jquery===t.jQuery)&&("holdReady"in a||"readyWait"in a)&&(r.jQuery=a,o(["jquery",[],function(){return jQuery}]),r.scriptCount)&&(V(a,!0),r.jQueryIncremented=!0)},s=function(){var a,b,c,f,g,h;L+=1,r.scriptCount<=0&&(r.scriptCount=0);for(;u.length;){if(a=u.shift(),a[0]===null)return d.onError(N("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));o(a)}if(!t.priorityWait||e())for(;r.paused.length;){g=r.paused,r.pausedCount+=g.length,r.paused=[];for(f=0;a=g[f];f++)b=a.map,c=b.url,h=b.fullName,b.prefix?j(b.prefix,a):!B[c]&&!y[h]&&(d.load(r,h,c),B[c]=!0);r.startTime=(new Date).getTime(),r.pausedCount-=g.length}L===1&&q(),L-=1},r={contextName:a,config:t,defQueue:u,waiting:z,waitCount:0,specified:v,loaded:y,urlMap:w,urlFetched:B,scriptCount:0,defined:x,paused:[],pausedCount:0,plugins:E,needFullExec:F,fake:{},fullExec:I,managerCallbacks:D,makeModuleMap:c,normalize:b,configure:function(a){var b,c,d;a.baseUrl&&a.baseUrl.charAt(a.baseUrl.length-1)!=="/"&&(a.baseUrl+="/"),b=t.paths,d=t.pkgs,Z(t,a,!0);if(a.paths){for(c in a.paths)c in K||(b[c]=a.paths[c]);t.paths=b}if((b=a.packagePaths)||a.packages){if(b)for(c in b)c in K||$(d,b[c],c);a.packages&&$(d,a.packages),t.pkgs=d}a.priority&&(c=r.requireWait,r.requireWait=!1,r.takeGlobalQueue(),s(),r.require(a.priority),s(),r.requireWait=c,t.priorityWait=a.priority),(a.deps||a.callback)&&r.require(a.deps||[],a.callback)},requireDefined:function(a,b){return c(a,b).fullName in x},requireSpecified:function(a,b){return c(a,b).fullName in v},require:function(b,e,f){if(typeof b=="string")return J(e)?d.onError(N("requireargs","Invalid require call")):d.get?d.get(r,b,e):(e=c(b,e),b=e.fullName,b in x?x[b]:d.onError(N("notloaded","Module name '"+e.fullName+"' has not been loaded yet for context: "+a)));(b&&b.length||e)&&n(null,b,e,f);if(!r.requireWait)for(;!r.scriptCount&&r.paused.length;)r.takeGlobalQueue(),s();return r.require},takeGlobalQueue:function(){U.length&&(ha.apply(r.defQueue,[r.defQueue.length-1,0].concat(U)),U=[])},completeLoad:function(a){var b;for(r.takeGlobalQueue();u.length;){if(b=u.shift(),b[0]===null){b[0]=a;break}if(b[0]===a)break;o(b),b=null}b?o(b):o([a,[],a==="jquery"&&typeof jQuery!="undefined"?function(){return jQuery}:null]),S(),d.isAsync&&(r.scriptCount-=1),s(),d.isAsync||(r.scriptCount-=1)},toUrl:function(a,b){var c=a.lastIndexOf("."),d=null;return c!==-1&&(d=a.substring(c,a.length),a=a.substring(0,c)),r.nameToUrl(a,d,b)},nameToUrl:function(a,c,e){var f,g,h,i,j=r.config,a=b(a,e&&e.fullName);if(d.jsExtRegExp.test(a))c=a+(c?c:"");else{f=j.paths,g=j.pkgs,e=a.split("/");for(i=e.length;i>0;i--){if(h=e.slice(0,i).join("/"),f[h]){e.splice(0,i,f[h]);break}if(h=g[h]){a=a===h.name?h.location+"/"+h.main:h.location,e.splice(0,i,a);break}}c=e.join("/")+(c||".js"),c=(c.charAt(0)==="/"||c.match(/^\w+:/)?"":j.baseUrl)+c}return j.urlArgs?c+((c.indexOf("?")===-1?"?":"&")+j.urlArgs):c}},r.jQueryCheck=S,r.resume=s,r}function ia(){var a,b,c;if(m&&m.readyState==="interactive")return m;a=document.getElementsByTagName("script");for(b=a.length-1;b>-1&&(c=a[b]);b--)if(c.readyState==="interactive")return m=c;return null}var ja=/(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,ka=/require\(\s*["']([^'"\s]+)["']\s*\)/g,da=/^\.\//,aa=/\.js$/,M=Object.prototype.toString,r=Array.prototype,ga=r.slice,ha=r.splice,G=typeof window!="undefined"&&!!navigator&&!!document,ba=!G&&typeof importScripts!="undefined",la=G&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,ca=typeof opera!="undefined"&&opera.toString()==="[object Opera]",K={},u={},U=[],m=null,X=0,O=!1,d,r={},I,w,y,z,v,A,B,H,C,S,W;if(typeof define=="undefined"){if(typeof requirejs!="undefined"){if(J(requirejs))return;r=requirejs,requirejs=void 0}typeof require!="undefined"&&!J(require)&&(r=require,require=void 0),d=requirejs=function(a,b,c){var d="_",e;return!E(a)&&typeof a!="string"&&(e=a,E(b)?(a=b,b=c):a=[]),e&&e.context&&(d=e.context),c=u[d]||(u[d]=ea(d)),e&&c.configure(e),c.require(a,b)},d.config=function(a){return d(a)},require||(require=d),d.toUrl=function(a){return u._.toUrl(a)},d.version="1.0.0",d.jsExtRegExp=/^\/|:|\?|\.js$/,w=d.s={contexts:u,skipAsync:{}};if(d.isAsync=d.isBrowser=G)if(y=w.head=document.getElementsByTagName("head")[0],z=document.getElementsByTagName("base")[0])y=w.head=z.parentNode;d.onError=function(a){throw a},d.load=function(a,b,c){d.resourcesReady(!1),a.scriptCount+=1,d.attach(c,a,b),a.jQuery&&!a.jQueryIncremented&&(V(a.jQuery,!0),a.jQueryIncremented=!0)},define=function(a,b,c){var d,e;typeof a!="string"&&(c=b,b=a,a=null),E(b)||(c=b,b=[]),!b.length&&J(c)&&c.length&&(c.toString().replace(ja,"").replace(ka,function(a,c){b.push(c)}),b=(c.length===1?["require"]:["require","exports","module"]).concat(b)),O&&(d=I||ia())&&(a||(a=d.getAttribute("data-requiremodule")),e=u[d.getAttribute("data-requirecontext")]),(e?e.defQueue:U).push([a,b,c])},define.amd={multiversion:!0,plugins:!0,jQuery:!0},d.exec=function(b){return eval(b)},d.execCb=function(a,b,c,d){return b.apply(d,c)},d.addScriptToDom=function(a){I=a,z?y.insertBefore(a,z):y.appendChild(a),I=null},d.onScriptLoad=function(a){var b=a.currentTarget||a.srcElement,c;if(a.type==="load"||b&&la.test(b.readyState))m=null,a=b.getAttribute("data-requirecontext"),c=b.getAttribute("data-requiremodule"),u[a].completeLoad(c),b.detachEvent&&!ca?b.detachEvent("onreadystatechange",d.onScriptLoad):b.removeEventListener("load",d.onScriptLoad,!1)},d.attach=function(a,b,c,e,f,g){var h;return G?(e=e||d.onScriptLoad,h=b&&b.config&&b.config.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),h.type=f||"text/javascript",h.charset="utf-8",h.async=!w.skipAsync[a],b&&h.setAttribute("data-requirecontext",b.contextName),h.setAttribute("data-requiremodule",c),h.attachEvent&&!ca?(O=!0,g?h.onreadystatechange=function(){h.readyState==="loaded"&&(h.onreadystatechange=null,h.attachEvent("onreadystatechange",e),g(h))}:h.attachEvent("onreadystatechange",e)):h.addEventListener("load",e,!1),h.src=a,g||d.addScriptToDom(h),h):(ba&&(importScripts(a),b.completeLoad(c)),null)};if(G){v=document.getElementsByTagName("script");for(H=v.length-1;H>-1&&(A=v[H]);H--){y||(y=A.parentNode);if(B=A.getAttribute("data-main")){r.baseUrl||(v=B.split("/"),A=v.pop(),v=v.length?v.join("/")+"/":"./",r.baseUrl=v,B=A.replace(aa,"")),r.deps=r.deps?r.deps.concat(B):[B];break}}}d.checkReadyState=function(){var a=w.contexts,b;for(b in a)if(!(b in K)&&a[b].waitCount)return;d.resourcesReady(!0)},d.resourcesReady=function(a){var b,c;d.resourcesDone=a;if(d.resourcesDone)for(c in a=w.contexts,a)!(c in K)&&(b=a[c],b.jQueryIncremented)&&(V(b.jQuery,!1),b.jQueryIncremented=!1)},d.pageLoaded=function(){document.readyState!=="complete"&&(document.readyState="complete")},G&&document.addEventListener&&!document.readyState&&(document.readyState="loading",window.addEventListener("load",d.pageLoaded,!1)),d(r),d.isAsync&&typeof setTimeout!="undefined"&&(C=w.contexts[r.context||"_"],C.requireWait=!0,setTimeout(function(){C.requireWait=!1,C.takeGlobalQueue(),C.jQueryCheck(),C.scriptCount||C.resume(),d.checkReadyState()},0))}})(),define("requireLib",function(){}),define("domReady",[],function(){function a(a){for(var b=0,c;c=a[b];b++)c(g)}function b(){var b=h,c=i;f&&(b.length&&(h=[],a(b)),j.resourcesDone&&c.length&&(i=[],a(c)))}function c(){f||(f=!0,l&&clearInterval(l),b())}function d(a){return f?a(g):h.push(a),d}var e=typeof window!="undefined"&&window.document,f=!e,g=e?document:null,h=[],i=[],j=requirejs||require||{},k=j.resourcesReady,l;return"resourcesReady"in j&&(j.resourcesReady=function(a){k&&k(a),a&&b()}),e&&(document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):window.attachEvent&&(window.attachEvent("onload",c),self===self.top&&(l=setInterval(function(){try{document.body&&(document.documentElement.doScroll("left"),c())}catch(a){}},30))),document.readyState==="complete"&&c()),d.withResources=function(a){return f&&j.resourcesDone?a(g):i.push(a),d},d.version="1.0.0",d.load=function(a,b,c,e){e.isBuild?c(null):d(c)},d}),require(["domReady"],function(a){}),define("setup-domready",function(){});
    // ====== END REQUIRE =====
    
		// set initial require settings, to find base path and give slower IE some time
		require.config({ 
			baseUrl: base_url,
      waitSeconds: 15
		});

		// setup require.ready and then launch the bootstrap
    require(["domReady"], function(domReady) {
      require.ready = domReady;
      bootstrap(context);
    });

		// expose the require library to the Global Scope
		var expose = function(varname, val) {
			window[varname] = window[varname] || val;
		};
		expose("require", require); 
		expose("define", define);
		expose("requirejs", requirejs); 
	};
	/**
	 * The Bootstrap, by Michael Wheeler
	 * Loads up sections of code based on:
	 *  - The active pages in setup
	 *  - Which page is currently being viewed in BigMachines
	 **/
	bootstrap = function(context) {
		var me = {}, repeat_until = context.repeat_until, ps = context.pubsub, log = {}, debug = window["framework/debug"] || false;

		if(!setup) {return;}

		me.window_url = document.location.href;

		/**
		 * This function allows us to add details to the setup
		 **/
		setup.extend = function(name, add) {
			var i, root;
			root = setup.pages[name];
			//don't spend time on inactive pages
			if(!root || !root.active) {return;}
			for(i in add) {
				if(!add.hasOwnProperty(i)) {continue;}
				root[i] = add[i];
			}
		};
		/**
		 * The pages object is used to identify which page is being viewed
		 **/
		setup.extend("sitewide", {
			always: true
		});
		setup.extend("commerce", {
			url_regex: ["/commerce/"],
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
        // when adding lines, the model_configs url shows in commerce
				var conf_form_exists = jQuery("form[name='configurationForm']").length > 0;
				if(conf_form_exists) {
					return true;
				}
				return false;
			}
		});
		setup.extend("homepage", {
			url_regex: ["commerce/display_company_profile.jsp", "/commerce/buyside/document.jsp"],
			match: function() {
				//requires a custom variable in the alt-homepage js
				if(window["framework/homepage"]) {return true;}
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
		me.get_doc_number = function() {
			var number = jQuery("input[name='_document_number']").val();
			number = parseInt(number);

			//only perform the DOM crawl once per page
			if(number) {
				me.get_doc_number = function() { return number; };
			}

			return number;
		};

		me.test_regex = function(page) {
			var i, ii, regex = page.url_regex || [];
			if(regex.length === 0) {return true;}

			for(i = 0, ii = regex.length; i<ii; i++) {
				if(me.window_url.search(regex[i]) > -1) {
					return true;
				}
			}

			return false;
		};

		me.test_match = function(page) {
			var test = page.match || function() {return true;};

			return test();
		};

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
		};

		me.show_log = function() {				
			var key, res="", div;
			for(key in log) {
				if(!log.hasOwnProperty(key)) {continue;}
				res += key + ": " + log[key]+"; ";
			}
					
			div = document.createElement("div");
			div.style.position = "absolute"; div.style.top = "100"; div.style.left = "10";div.style.color="red";
			div.innerHTML = "bm-framework.js log results:("+res+")";
			document.body.appendChild(div);
		};

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

			for(i in testees) {
				if(!testees.hasOwnProperty(i)) {continue;}
				if(testees[i].active !== true) {continue;}
				curr_page = setup.pages[i];
				if(!curr_page) {
					throw new Error("Problem initiating BigMachines JavaScript framework. File "+ i + " has not been configured.");
				}

				me.search_for(i, curr_page);
			}

			//this function will fire over and over until the searches are cleared
			repeat_until(function() {
				var search_topic = ps.functions["searches"];

				if(search_topic && search_topic.length > 0) {
					ps.pub("searches");
					return false;
				}
				return true;
			}, delay).timeout(function() {
				ps.pub("search-timeout");
			}, timeout);
		};

		me.begin();
		require.ready(function() {
			if(debug) { me.show_log(); }
		});
	};
	
	// only load if there is an active page
  // wait for _BM_HOST_COMPANY - necessary in config
	(function() {
		var i, maxtime=5000, go;

		go = function() {
			context.repeat_until(function() {
				return typeof _BM_HOST_COMPANY === "string";
			}).and_then(function() {
				initiate_require(context, bootstrap);
			}).timeout(function() {
				throw new Error("BigMachines Critical Framework Error: Timed out looking for _BM_HOST_COMPANY. Try putting the reference to bm-framework.js in the footer. If that still doesn't help you may need to manually set _BM_HOST_COMPANY in the header.");
			}, maxtime);
		};

		for(i in setup.pages) {
			if(!setup.pages.hasOwnProperty(i)) {continue;}
			if(setup.pages[i].active === true){go();break;}
		}
	}());

	context.setup = setup;
	context.initiate_require = initiate_require;
	context.bootstrap = bootstrap;
}(window["framework/testing-hook"] || {}));
