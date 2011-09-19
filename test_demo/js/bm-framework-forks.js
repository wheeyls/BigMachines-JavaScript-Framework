var requirejs, require, define; (function() { initiate_requirejs();
require([], function() {
	var me = {}, ps = {};

	/**
	 * Uncomment to activate individual pages
	 */
	me.active = [
		"sitewide",
		"commerce",
		"commerce_line",
		"config",
		"homepage"
	];

	/**
	 * Support for the framework begins here. The purpose of this code is to:
	 * - Determine which page the user is currently viewing
	 * - Load any activated JavaScript when viewing the page it corresponds to
	 **/
	if(typeof _BM_HOST_COMPANY === "string") {
		require.config({baseUrl: "/bmfsweb/" + _BM_HOST_COMPANY + "/image/javascript"});
	}

	me.window_url = document.location.href;

	/**
	 * Bare-bones, fast, publish/subscribe
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
	 * The pages object is used to identify which page is being viewed
	 **/
	me.pages = {
		sitewide: { 
			always: true,
		},
		commerce: {
			url_regex: ["/commerce/buyside/document.jsp"],
			match: function() {
				var doc_form_exists = !!document.bmDocForm;
				if(doc_form_exists) {
					return me.pages.get_doc_number() === 1;
				}
				
				return false;
			}
		},
		commerce_line: {
			url_regex: ["/commerce/buyside/document.jsp"],
			match: function() {
				var doc_form_exists = !!document.bmDocForm;
				if(doc_form_exists) {
					return me.pages.get_doc_number() > 1;
				}
				
				return false;
			}
		},
		config: {
			url_regex:["/model_configs.jsp"],
			match: function() {
				var configFormExists = !!document.configurationForm;
				return true;
			}
		},
		homepage: {
			url_regex: ["commerce/display_company_profile.jsp"],
			match: function() {
				var userIsSet = typeof _BM_USER_LOGIN === "string" && _BM_USER_LOGIN !== "";
				return userIsSet;
			}
		},
		run: function(name) {
			require([name]);
		},
		get_doc_number: function() {
			var elements = document.getElementsByName("_document_number"), number = -1;
			if(elements.length === 1) {
				number = elements[0].value;
				number = parseInt(number);
			}
			//only perform the DOM crawl once per page
			if(number) {
				me.pages.get_doc_number = function() { return number; }
			}

			return number;
		}
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
	}

	me.test_match = function(page) {
		var test = page.match || function() {return true;}

		return test();
	}

	me.search_for = function(name, page) {
		//don't check for sitewide code
		if(page.always === true) {
			me.pages.run(name);
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

	/**
	 * The magic starts here.
	 */
	me.begin = function() {
		var i, ii, curr_page, delay=50, timeout=3000;

		ps.sub("found-match", function(name) {
			ps.clear("searches");

			me.pages.run(name);
		});

		ps.sub("search-timeout", function() {
			ps.clear("searches");
		});
		window.setTimeout(function() {ps.pub("search-timeout");}, timeout);

		for(i=0, ii = me.active.length; i<ii; i++) {
			curr_page = me.pages[me.active[i]];
			if(!curr_page) {
				throw new Error("Problem initiating BigMachines JavaScript framework. File "+ me.active[i] + " has not been configured.");
			}

			me.search_for(me.active[i], curr_page);
		}

		//this function will fire over and over until the searches are cleared
		function poll_searches() {
			var search_topic = ps.functions["searches"];

			if(search_topic && search_topic.length > 0) {
				ps.pub("searches");

				window.setTimeout(poll_searches, delay);
			}
		}
		window.setTimeout(poll_searches, delay);
	}


	me.begin();
	require.ready(function() {
		// if the page is ready, stop searching
		ps.clear("searches");
	});
});

function initiate_requirejs() {

/*
 RequireJS 0.26.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/


// PATCH by Mike Wheeler. Moved declarations to top, they MUST be global
//var requirejs, require, define;
(function(){function M(a){return $.call(a)==="[object Function]"}function E(a){return $.call(a)==="[object Array]"}function V(a,c,g){for(var e in c)if(!(e in J)&&(!(e in a)||g))a[e]=c[e];return d}function R(a,c,d){a=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+a);if(d)a.originalError=d;return a}function aa(a,c,d){var e,x,j;for(e=0;j=c[e];e++){j=typeof j==="string"?{name:j}:j;x=j.location;if(d&&(!x||x.indexOf("/")!==0&&x.indexOf(":")===-1))x=d+"/"+(x||j.name);a[j.name]={name:j.name,location:x||
j.name,main:(j.main||"main").replace(fa,"").replace(ba,"")}}}function W(a,d){a.holdReady?a.holdReady(d):d?a.readyWait+=1:a.ready(!0)}function ga(a){function c(b,h){var n,o;if(b&&b.charAt(0)==="."&&h){p.pkgs[h]?h=[h]:(h=h.split("/"),h=h.slice(0,h.length-1));n=b=h.concat(b.split("/"));var a;for(o=0;a=n[o];o++)if(a===".")n.splice(o,1),o-=1;else if(a==="..")if(o===1&&(n[2]===".."||n[0]===".."))break;else o>0&&(n.splice(o-1,2),o-=2);o=p.pkgs[n=b[0]];b=b.join("/");o&&b===n+"/"+o.main&&(b=n)}return b}function g(b,
h){var n=b?b.indexOf("!"):-1,o=null,a=h?h.name:null,ha=b,g,l;n!==-1&&(o=b.substring(0,n),b=b.substring(n+1,b.length));o&&(o=c(o,a));b&&(g=o?(n=m[o])?n.normalize?n.normalize(b,function(b){return c(b,a)}):c(b,a):"__$p"+a+"@"+(b||""):c(b,a),l=E[g],l||(l=d.toModuleUrl?d.toModuleUrl(f,g,h):f.nameToUrl(g,null,h),E[g]=l));return{prefix:o,name:g,parentMap:h,url:l,originalName:ha,fullName:o?o+"!"+(g||""):g}}function e(){var b=!0,h=p.priorityWait,n,a;if(h){for(a=0;n=h[a];a++)if(!s[n]){b=!1;break}b&&delete p.priorityWait}return b}
function x(b){return function(h){b.exports=h}}function j(b,h,n){return function(){var a=[].concat(ia.call(arguments,0)),d;if(n&&M(d=a[a.length-1]))d.__requireJsBuild=!0;a.push(h);return b.apply(null,a)}}function q(b,h){var a=j(f.require,b,h);V(a,{nameToUrl:j(f.nameToUrl,b),toUrl:j(f.toUrl,b),defined:j(f.requireDefined,b),specified:j(f.requireSpecified,b),ready:d.ready,isBrowser:d.isBrowser});if(d.paths)a.paths=d.paths;return a}function v(b){var h=b.prefix,a=b.fullName;y[a]||a in m||(h&&!K[h]&&(K[h]=
void 0,(S[h]||(S[h]=[])).push(b),(t[h]||(t[h]=[])).push({onDep:function(b){if(b===h){var a,n,d,c,f,e,j=S[h];if(j)for(d=0;a=j[d];d++)if(b=a.fullName,a=g(a.originalName,a.parentMap),a=a.fullName,n=t[b]||[],c=t[a],a!==b){b in y&&(delete y[b],y[a]=!0);t[a]=c?c.concat(n):n;delete t[b];for(c=0;c<n.length;c++){e=n[c].depArray;for(f=0;f<e.length;f++)e[f]===b&&(e[f]=a)}}delete S[h]}}}),v(g(h))),f.paused.push(b))}function w(b){var h,a,c;h=b.callback;var k=b.fullName,e=[],j=b.depArray;if(h&&M(h)){if(j)for(h=
0;h<j.length;h++)e.push(b.deps[j[h]]);if(p.catchError.define)try{a=d.execCb(k,b.callback,e,m[k])}catch(l){c=l}else a=d.execCb(k,b.callback,e,m[k]);if(k)b.cjsModule&&b.cjsModule.exports!==void 0?a=m[k]=b.cjsModule.exports:a===void 0&&b.usingExports?a=m[k]:m[k]=a}else k&&(a=m[k]=h);if(F[b.waitId])delete F[b.waitId],b.isDone=!0,f.waitCount-=1,f.waitCount===0&&(I=[]);if(c)return a=(k?g(k).url:"")||c.fileName||c.sourceURL,c=R("defineerror",'Error evaluating module "'+k+'" at location "'+a+'":\n'+c+"\nfileName:"+
a+"\nlineNumber: "+(c.lineNumber||c.line),c),c.moduleName=k,d.onError(c);if(k&&(c=t[k])){for(h=0;h<c.length;h++)c[h].onDep(k,a);delete t[k]}}function z(b,a,c,d){var b=g(b,d),k=b.name,e=b.fullName,j={},l={waitId:k||ja+Q++,depCount:0,depMax:0,prefix:b.prefix,name:k,fullName:e,deps:{},depArray:a,callback:c,onDep:function(b,a){b in l.deps||(l.deps[b]=a,l.depCount+=1,l.depCount===l.depMax&&w(l))}},i,r;if(e){if(e in m||s[e]===!0||e==="jquery"&&p.jQuery&&p.jQuery!==c().fn.jquery)return;y[e]=!0;s[e]=!0;e===
"jquery"&&c&&T(c())}for(c=0;c<a.length;c++)if(i=a[c])i=g(i,k?b:d),r=i.fullName,a[c]=r,r==="require"?l.deps[r]=q(b):r==="exports"?(l.deps[r]=m[e]={},l.usingExports=!0):r==="module"?(l.cjsModule=i=l.deps[r]={id:k,uri:k?f.nameToUrl(k,null,d):void 0,exports:m[e]},i.setExports=x(i)):r in m&&!(r in F)?l.deps[r]=m[r]:j[r]||(l.depMax+=1,v(i),(t[r]||(t[r]=[])).push(l),j[r]=!0);l.depCount===l.depMax?w(l):(F[l.waitId]=l,I.push(l),f.waitCount+=1)}function u(b){z.apply(null,b);s[b[0]]=!0}function C(b,a){if(!b.isDone){var c=
b.fullName,d=b.depArray,f,e;if(c){if(a[c])return m[c];a[c]=!0}for(e=0;e<d.length;e++)if((f=d[e])&&!b.deps[f]&&F[f])b.onDep(f,C(F[f],a));return c?m[c]:void 0}}function A(){var b=p.waitSeconds*1E3,a=b&&f.startTime+b<(new Date).getTime(),b="",c=!1,g=!1,k;if(!(f.pausedCount>0)){if(p.priorityWait)if(e())G();else return;for(k in s)if(!(k in J)&&(c=!0,!s[k]))if(a)b+=k+" ";else{g=!0;break}if(c||f.waitCount){if(a&&b)return k=R("timeout","Load timeout for modules: "+b),k.requireType="timeout",k.requireModules=
b,d.onError(k);if(g||f.scriptCount){if((B||ca)&&!X)X=setTimeout(function(){X=0;A()},50)}else{if(f.waitCount){for(H=0;b=I[H];H++)C(b,{});Y<5&&(Y+=1,A())}Y=0;d.checkReadyState()}}}}function D(b,a){var c=a.name,e=a.fullName,g;if(!(e in m||e in s))K[b]||(K[b]=m[b]),s[e]||(s[e]=!1),g=function(g){if(d.onPluginLoad)d.onPluginLoad(f,b,c,g);w({prefix:a.prefix,name:a.name,fullName:a.fullName,callback:function(){return g}});s[e]=!0},g.fromText=function(b,a){var c=N;f.loaded[b]=!1;f.scriptCount+=1;c&&(N=!1);
d.exec(a);c&&(N=!0);f.completeLoad(b)},K[b].load(c,q(a.parentMap,!0),g,p)}function L(b){b.prefix&&b.name&&b.name.indexOf("__$p")===0&&m[b.prefix]&&(b=g(b.originalName,b.parentMap));var a=b.prefix,c=b.fullName,e=f.urlFetched;!y[c]&&!s[c]&&(y[c]=!0,a?m[a]?D(a,b):(O[a]||(O[a]=[],(t[a]||(t[a]=[])).push({onDep:function(b){if(b===a){for(var c,d=O[a],b=0;b<d.length;b++)c=d[b],D(a,g(c.originalName,c.parentMap));delete O[a]}}})),O[a].push(b)):e[b.url]||(d.load(f,c,b.url),e[b.url]=!0))}var f,G,p={waitSeconds:7,
baseUrl:i.baseUrl||"./",paths:{},pkgs:{},catchError:{}},P=[],y={require:!0,exports:!0,module:!0},E={},m={},s={},F={},I=[],Q=0,t={},K={},O={},Z=0,S={};T=function(b){if(!f.jQuery&&(b=b||(typeof jQuery!=="undefined"?jQuery:null))&&!(p.jQuery&&b.fn.jquery!==p.jQuery)&&("holdReady"in b||"readyWait"in b))if(f.jQuery=b,u(["jquery",[],function(){return jQuery}]),f.scriptCount)W(b,!0),f.jQueryIncremented=!0};G=function(){var b,a,c;Z+=1;if(f.scriptCount<=0)f.scriptCount=0;for(;P.length;)if(b=P.shift(),b[0]===
null)return d.onError(R("mismatch","Mismatched anonymous define() module: "+b[b.length-1]));else u(b);if(!p.priorityWait||e())for(;f.paused.length;){c=f.paused;f.pausedCount+=c.length;f.paused=[];for(a=0;b=c[a];a++)L(b);f.startTime=(new Date).getTime();f.pausedCount-=c.length}Z===1&&A();Z-=1};f={contextName:a,config:p,defQueue:P,waiting:F,waitCount:0,specified:y,loaded:s,urlMap:E,scriptCount:0,urlFetched:{},defined:m,paused:[],pausedCount:0,plugins:K,managerCallbacks:t,makeModuleMap:g,normalize:c,
configure:function(b){var a,c,e;b.baseUrl&&b.baseUrl.charAt(b.baseUrl.length-1)!=="/"&&(b.baseUrl+="/");a=p.paths;e=p.pkgs;V(p,b,!0);if(b.paths){for(c in b.paths)c in J||(a[c]=b.paths[c]);p.paths=a}if((a=b.packagePaths)||b.packages){if(a)for(c in a)c in J||aa(e,a[c],c);b.packages&&aa(e,b.packages);p.pkgs=e}if(b.priority)c=f.requireWait,f.requireWait=!1,f.takeGlobalQueue(),G(),f.require(b.priority),G(),f.requireWait=c,p.priorityWait=b.priority;if(b.deps||b.callback)f.require(b.deps||[],b.callback);
b.ready&&d.ready(b.ready)},requireDefined:function(b,a){return g(b,a).fullName in m},requireSpecified:function(b,a){return g(b,a).fullName in y},require:function(b,c,e){if(typeof b==="string"){if(d.get)return d.get(f,b,c);c=g(b,c);b=c.fullName;return!(b in m)?d.onError(R("notloaded","Module name '"+c.fullName+"' has not been loaded yet for context: "+a)):m[b]}z(null,b,c,e);if(!f.requireWait)for(;!f.scriptCount&&f.paused.length;)f.takeGlobalQueue(),G();return f.require},takeGlobalQueue:function(){U.length&&
(ka.apply(f.defQueue,[f.defQueue.length-1,0].concat(U)),U=[])},completeLoad:function(b){var a;for(f.takeGlobalQueue();P.length;)if(a=P.shift(),a[0]===null){a[0]=b;break}else if(a[0]===b)break;else u(a),a=null;a?u(a):u([b,[],b==="jquery"&&typeof jQuery!=="undefined"?function(){return jQuery}:null]);s[b]=!0;T();d.isAsync&&(f.scriptCount-=1);G();d.isAsync||(f.scriptCount-=1)},toUrl:function(b,a){var c=b.lastIndexOf("."),d=null;c!==-1&&(d=b.substring(c,b.length),b=b.substring(0,c));return f.nameToUrl(b,
d,a)},nameToUrl:function(b,a,e){var g,j,i,m,l=f.config,b=c(b,e&&e.fullName);if(d.jsExtRegExp.test(b))a=b+(a?a:"");else{g=l.paths;j=l.pkgs;e=b.split("/");for(m=e.length;m>0;m--)if(i=e.slice(0,m).join("/"),g[i]){e.splice(0,m,g[i]);break}else if(i=j[i]){b=b===i.name?i.location+"/"+i.main:i.location;e.splice(0,m,b);break}a=e.join("/")+(a||".js");a=(a.charAt(0)==="/"||a.match(/^\w+:/)?"":l.baseUrl)+a}return l.urlArgs?a+((a.indexOf("?")===-1?"?":"&")+l.urlArgs):a}};f.jQueryCheck=T;f.resume=G;return f}function la(){var a,
c,d;if(C&&C.readyState==="interactive")return C;a=document.getElementsByTagName("script");for(c=a.length-1;c>-1&&(d=a[c]);c--)if(d.readyState==="interactive")return C=d;return null}var ma=/(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,na=/require\(\s*["']([^'"\s]+)["']\s*\)/g,fa=/^\.\//,ba=/\.js$/,$=Object.prototype.toString,q=Array.prototype,ia=q.slice,ka=q.splice,B=!!(typeof window!=="undefined"&&navigator&&document),ca=!B&&typeof importScripts!=="undefined",oa=B&&navigator.platform==="PLAYSTATION 3"?/^complete$/:
/^(complete|loaded)$/,da=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",ja="_r@@",J={},z={},U=[],C=null,Y=0,N=!1,d,q={},I,i,u,L,v,A,D,H,Q,ea,w,T,X;if(typeof define==="undefined"){if(typeof requirejs!=="undefined")if(M(requirejs))return;else q=requirejs,requirejs=void 0;typeof require!=="undefined"&&!M(require)&&(q=require,require=void 0);d=requirejs=function(a,c,d){var e="_",i;!E(a)&&typeof a!=="string"&&(i=a,E(c)?(a=c,c=d):a=[]);if(i&&i.context)e=i.context;d=z[e]||(z[e]=ga(e));i&&
d.configure(i);return d.require(a,c)};d.config=function(a){return d(a)};typeof require==="undefined"&&(require=d);d.toUrl=function(a){return z._.toUrl(a)};d.version="0.26.0";d.isArray=E;d.isFunction=M;d.mixin=V;d.jsExtRegExp=/^\/|:|\?|\.js$/;i=d.s={contexts:z,skipAsync:{},isPageLoaded:!B,readyCalls:[]};if(d.isAsync=d.isBrowser=B)if(u=i.head=document.getElementsByTagName("head")[0],L=document.getElementsByTagName("base")[0])u=i.head=L.parentNode;d.onError=function(a){throw a;};d.load=function(a,c,
g){var e=a.loaded;e[c]||(e[c]=!1);a.scriptCount+=1;d.attach(g,a,c);if(a.jQuery&&!a.jQueryIncremented)W(a.jQuery,!0),a.jQueryIncremented=!0};define=d.def=function(a,c,g){var e,i;typeof a!=="string"&&(g=c,c=a,a=null);d.isArray(c)||(g=c,c=[]);!a&&!c.length&&d.isFunction(g)&&g.length&&(g.toString().replace(ma,"").replace(na,function(a,d){c.push(d)}),c=(g.length===1?["require"]:["require","exports","module"]).concat(c));if(N&&(e=I||la()))a||(a=e.getAttribute("data-requiremodule")),i=z[e.getAttribute("data-requirecontext")];
(i?i.defQueue:U).push([a,c,g])};define.amd={multiversion:!0,plugins:!0,jQuery:!0};d.exec=function(a){return eval(a)};d.execCb=function(a,c,d,e){return c.apply(e,d)};d.onScriptLoad=function(a){var c=a.currentTarget||a.srcElement,g;if(a.type==="load"||oa.test(c.readyState))C=null,a=c.getAttribute("data-requirecontext"),g=c.getAttribute("data-requiremodule"),z[a].completeLoad(g),c.detachEvent&&!da?c.detachEvent("onreadystatechange",d.onScriptLoad):c.removeEventListener("load",d.onScriptLoad,!1)};d.attach=
function(a,c,g,e,q){var j;if(B)return e=e||d.onScriptLoad,j=c&&c.config&&c.config.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),j.type=q||"text/javascript",j.charset="utf-8",j.async=!i.skipAsync[a],c&&j.setAttribute("data-requirecontext",c.contextName),j.setAttribute("data-requiremodule",g),j.attachEvent&&!da?(N=!0,j.attachEvent("onreadystatechange",e)):j.addEventListener("load",e,!1),j.src=a,I=j,L?u.insertBefore(j,L):u.appendChild(j),
I=null,j;else if(ca)e=c.loaded,e[g]=!1,importScripts(a),c.completeLoad(g);return null};if(B){v=document.getElementsByTagName("script");for(H=v.length-1;H>-1&&(A=v[H]);H--){if(!u)u=A.parentNode;if(D=A.getAttribute("data-main")){if(!q.baseUrl)v=D.split("/"),A=v.pop(),v=v.length?v.join("/")+"/":"./",q.baseUrl=v,D=A.replace(ba,"");q.deps=q.deps?q.deps.concat(D):[D];break}}}i.baseUrl=q.baseUrl;d.pageLoaded=function(){if(!i.isPageLoaded){i.isPageLoaded=!0;Q&&clearInterval(Q);if(ea)document.readyState="complete";
d.callReady()}};d.checkReadyState=function(){var a=i.contexts,c;for(c in a)if(!(c in J)&&a[c].waitCount)return;i.isDone=!0;d.callReady()};d.callReady=function(){var a=i.readyCalls,c,d,e;if(i.isPageLoaded&&i.isDone){if(a.length){i.readyCalls=[];for(c=0;d=a[c];c++)d()}a=i.contexts;for(e in a)if(!(e in J)&&(c=a[e],c.jQueryIncremented))W(c.jQuery,!1),c.jQueryIncremented=!1}};d.ready=function(a){i.isPageLoaded&&i.isDone?a():i.readyCalls.push(a);return d};if(B){if(document.addEventListener){if(document.addEventListener("DOMContentLoaded",
d.pageLoaded,!1),window.addEventListener("load",d.pageLoaded,!1),!document.readyState)ea=!0,document.readyState="loading"}else window.attachEvent&&(window.attachEvent("onload",d.pageLoaded),self===self.top&&(Q=setInterval(function(){try{document.body&&(document.documentElement.doScroll("left"),d.pageLoaded())}catch(a){}},30)));document.readyState==="complete"&&d.pageLoaded()}d(q);if(d.isAsync&&typeof setTimeout!=="undefined")w=i.contexts[q.context||"_"],w.requireWait=!0,setTimeout(function(){w.requireWait=
!1;w.takeGlobalQueue();w.jQueryCheck();w.scriptCount||w.resume();d.checkReadyState()},0)}})();

}
}());
