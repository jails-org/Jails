!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("jails",[],t):"object"==typeof exports?exports.jails=t():e.jails=t()}(self,(()=>(()=>{var e={492:(e,t,n)=>{"use strict";var r;n.r(t),n.d(t,{default:()=>d});var o="undefined"==typeof document?void 0:document,i=!!o&&"content"in o.createElement("template"),a=!!o&&o.createRange&&"createContextualFragment"in o.createRange();function u(e,t){var n,r,o=e.nodeName,i=t.nodeName;return o===i||(n=o.charCodeAt(0),r=i.charCodeAt(0),n<=90&&r>=97?o===i.toUpperCase():r<=90&&n>=97&&i===o.toUpperCase())}function c(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var s={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}c(e,t,"selected")},INPUT:function(e,t){c(e,t,"checked"),c(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var o=r.nodeValue;if(o==n||!n&&o==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,o=-1,i=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){o=i;break}i++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=o}}};function l(){}function f(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}const d=function(e,t,n){if(n||(n={}),"string"==typeof t)if("#document"===e.nodeName||"HTML"===e.nodeName||"BODY"===e.nodeName){var c=t;(t=o.createElement("html")).innerHTML=c}else d=(d=t).trim(),t=i?function(e){var t=o.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(d):a?function(e){return r||(r=o.createRange()).selectNode(o.body),r.createContextualFragment(e).childNodes[0]}(d):function(e){var t=o.createElement("body");return t.innerHTML=e,t.childNodes[0]}(d);var d,p=n.getNodeKey||f,m=n.onBeforeNodeAdded||l,v=n.onNodeAdded||l,h=n.onBeforeElUpdated||l,g=n.onElUpdated||l,b=n.onBeforeNodeDiscarded||l,y=n.onNodeDiscarded||l,x=n.onBeforeElChildrenUpdated||l,_=!0===n.childrenOnly,A=Object.create(null),N=[];function T(e){N.push(e)}function S(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=p(n))?T(r):(y(n),n.firstChild&&S(n,t)),n=n.nextSibling}}function w(e,t,n){!1!==b(e)&&(t&&t.removeChild(e),y(e),S(e,n))}function E(e){v(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=p(t);if(r){var o=A[r];o&&u(t,o)?(t.parentNode.replaceChild(o,t),O(o,t)):E(t)}else E(t);t=n}}function O(e,t,n){var r=p(t);if(r&&delete A[r],!n){if(!1===h(e,t))return;if(function(e,t){var n,r,o,i,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var u=a.length-1;u>=0;u--)r=(n=a[u]).name,o=n.namespaceURI,i=n.value,o?(r=n.localName||r,e.getAttributeNS(o,r)!==i&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(o,r,i))):e.getAttribute(r)!==i&&e.setAttribute(r,i);for(var c=e.attributes,s=c.length-1;s>=0;s--)r=(n=c[s]).name,(o=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(o,r)||e.removeAttributeNS(o,r)):t.hasAttribute(r)||e.removeAttribute(r)}}(e,t),g(e),!1===x(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,i,a,c,l=t.firstChild,f=e.firstChild;e:for(;l;){for(a=l.nextSibling,n=p(l);f;){if(i=f.nextSibling,l.isSameNode&&l.isSameNode(f)){l=a,f=i;continue e}r=p(f);var d=f.nodeType,v=void 0;if(d===l.nodeType&&(1===d?(n?n!==r&&((c=A[n])?i===c?v=!1:(e.insertBefore(c,f),r?T(r):w(f,e,!0),f=c):v=!1):r&&(v=!1),(v=!1!==v&&u(f,l))&&O(f,l)):3!==d&&8!=d||(v=!0,f.nodeValue!==l.nodeValue&&(f.nodeValue=l.nodeValue))),v){l=a,f=i;continue e}r?T(r):w(f,e,!0),f=i}if(n&&(c=A[n])&&u(c,l))e.appendChild(c),O(c,l);else{var h=m(l);!1!==h&&(h&&(l=h),l.actualize&&(l=l.actualize(e.ownerDocument||o)),e.appendChild(l),E(l))}l=a,f=i}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=p(t))?T(n):w(t,e,!0),t=r}}(e,f,r);var g=s[e.nodeName];g&&g(e,t)}(e,t):s.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=p(n);r&&(A[r]=n),e(n),n=n.nextSibling}}(e);var C,j,P=e,F=P.nodeType,I=t.nodeType;if(!_)if(1===F)1===I?u(e,t)||(y(e),P=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(e,(C=t.nodeName,(j=t.namespaceURI)&&"http://www.w3.org/1999/xhtml"!==j?o.createElementNS(j,C):o.createElement(C)))):P=t;else if(3===F||8===F){if(I===F)return P.nodeValue!==t.nodeValue&&(P.nodeValue=t.nodeValue),P;P=t}if(P===t)y(e);else{if(t.isSameNode&&t.isSameNode(P))return;if(O(P,t,_),N)for(var R=0,M=N.length;R<M;R++){var H=A[N[R]];H&&w(H,H.parentNode,!1)}}return!_&&P!==e&&e.parentNode&&(P.actualize&&(P=P.actualize(e.ownerDocument||o)),e.parentNode.replaceChild(P,e)),P}},565:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var o=r(n(492)),i=n(502),a=n(139),u=n(119);t.default=function(e,t){var n=t.module,r=t.dependencies,l=t.templates,f=t.components,d=c(n);(0,i.buildtemplates)(e,f,l);var p=e.getAttribute("tplid"),m=p?l[p]:null,v={data:n.model?(0,i.dup)(n.model):{}},h={template:m,elm:e,dependencies:r,publish:u.publish,subscribe:u.subscribe,unsubscribe:u.unsubscribe,main:function(e){d.main=e},unmount:function(e){d.unmount=e},onupdate:function(e){d.onupdate=e},on:function(t,n,r){(0,a.on)(e,t,n,r)},off:function(t,n){(0,a.off)(e,t,n)},trigger:function(t,n,r){n.constructor===String?(0,a.trigger)(e.querySelector(n),t,{args:r}):(0,a.trigger)(e,t,{args:n})},emit:function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];(0,a.trigger)(e,t.shift(),{args:t})},state:{set:function(e){if(e.constructor===Function){var t=(0,i.dup)(v.data);e(t),h.render(t)}else h.render(e);return new Promise((function(e){return(0,i.rAF)((function(t){return(0,i.rAF)(e)}))}))},get:function(){return(0,i.dup)(v.data)}},render:function(t){if(void 0===t&&(t=v.data),document.body.contains(e)){v.data=Object.assign(v.data,t);var n=(0,i.dup)(v.data),r=h.template(d.view(n));(0,o.default)(e,r,s(e,d)),(0,i.rAF)((function(t){Array.from(e.querySelectorAll("[tplid]")).forEach((function(e){e.options.onupdate(n),e.base.render(n)}))}))}}};return{base:h,options:d}};var c=function(e){return{main:function(e){return e},unmount:function(e){return e},onupdate:function(e){return e},view:e.view?e.view:function(e){return e}}},s=function(e,t){return{onNodeAdded:f(e,t),onElUpdated:f(e,t),onBeforeElChildrenUpdated:l,onBeforeElUpdated:l,getNodeKey:function(e){return!(1!==e.nodeType||!e.getAttribute("tplid"))&&(e.dataset.key||e.getAttribute("tplid"))}}},l=function(e){if("static"in e.dataset)return!1},f=function(e,t){return function(n){if(1===n.nodeType&&n.getAttribute&&n.getAttribute("scope")){var r=JSON.parse(n.getAttribute("scope").replace(/\'/g,'"'));Array.from(n.querySelectorAll("[tplid]")).map((function(n){var o=Object.assign({},e.base.state.get(),r);t.onupdate(o),n.base.render(o)})),n.removeAttribute("scope")}return n}}},747:function(e,t,n){"use strict";var r,o=this&&this.__extends||(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var a=i(n(565));t.default=function(e,t,n,r){return function(i){function u(){var o=i.call(this)||this,u=(0,a.default)(o,{module:e,dependencies:t,templates:n,components:r}),c=u.base,s=u.options;return o.base=c,o.options=s,e.default(c),o}return o(u,i),u.prototype.connectedCallback=function(){var e=this;this.base.render(),this.options.main().forEach((function(t){return t(e.base)}))},u.prototype.disconnectedCallback=function(){this.options.unmount(this.base),delete this.options,delete this.base,delete this.__events},u.prototype.attributeChangedCallback=function(){},u}(HTMLElement)}},341:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.components=t.templates=void 0;var o=n(502),i=r(n(747));t.templates={},t.components={},t.default={register:function(e,n,r){void 0===r&&(r={}),t.components[e]={name:e,module:n,dependencies:r}},start:function(){var e=document.body;(0,o.buildtemplates)(e,t.components,t.templates),a()}};var a=function(){Object.values(t.components).forEach((function(e){var n=e,r=n.name,o=n.module,a=n.dependencies,u=(0,i.default)(o,a,t.templates,t.components);customElements.define(r,u)}))}},585:function(e,t,n){"use strict";var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},r.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var o=n(641),i=n(502),a=r(r({},o.defaultConfig),{tags:["{","}"],useWith:!0});t.default=function(e){var t=document.createElement("template");t.innerHTML=e.outerHTML.replace(/<\/?template[^>]*>/g,""),u(t.content);var n=(0,i.decodeHtmlEntities)(t.innerHTML.replace(/html-(selected|checked|readonly|disabled|autoplay)=\"(.*)\"/g,"{@if ($2) }$1{/if}").replace(/html-/g,"")),r=(0,o.compile)(n,a);return function(e){return r(e,a)}};var u=function(e){var t=Array.from(e.querySelectorAll("[html-for],[html-if],[html-foreach]")).reverse();return t.length&&t.forEach((function(e){if(e.getAttribute("html-foreach")){var t=(i=(a=e.getAttribute("html-foreach")).match(/(.*)\sin\s(.*)/))[1],n=i[2];e.removeAttribute("html-foreach"),e.setAttribute("scope","{".concat(t," | JSON($key, '").concat(t,"')}"));var r=document.createTextNode("{@foreach(".concat(n,") => $key, ").concat(t,"}")),o=document.createTextNode("{/foreach}");c(r,e,o)}else if(e.getAttribute("html-for")){var i;t=(i=(a=e.getAttribute("html-for")).match(/(.*)\sin\s(.*)/))[1],n=i[2],e.removeAttribute("html-for"),e.setAttribute("scope","{".concat(t," | JSON($index, '").concat(t,"')}")),r=document.createTextNode("{@each(".concat(n,") => ").concat(t,", $index}")),o=document.createTextNode("{/each}"),c(r,e,o)}else if(e.getAttribute("html-if")){var a=e.getAttribute("html-if");e.removeAttribute("html-if"),r=document.createTextNode("{@if (".concat(a,") }")),o=document.createTextNode("{/if}"),c(r,e,o)}})),e};o.filters.define("JSON",(function(e,t,n){var r=t.constructor==String?"$key":"$index",o={$index:t};return o[n]=e,o[r]=t,JSON.stringify(o)}));var c=function(e,t,n){t.parentNode.insertBefore(e,t),t.parentNode.insertBefore(n,t.nextSibling)}},139:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.trigger=t.off=t.on=void 0;var n="CustomEvent"in window&&"function"==typeof window.CustomEvent?function(e,t){return new CustomEvent(e,t)}:function(e,t){var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},r=function(e,t){e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},o=function(e,t,n){return function(r){for(var o=r.detail||{},i=r.target;i&&(i.matches(t)&&(r.delegateTarget=i,n.apply(this,[r].concat(o.args))),i!==e);)i=i.parentNode}};t.on=function(e,t,n,r){if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){var i=function(e,t){return function(n){var r=this,o=n.detail||{};e.__events[t].forEach((function(e){e.handler.apply(r,[n].concat(o.args))}))}}(e,t);e.addEventListener(t,i,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=i}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:o(e,n,r),callback:r})},t.off=function(e,t,n){if(n&&e.__events[t]&&e.__events[t].length){var o=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=o.listener,e.__events[t].length||r(e,t)}else r(e,t)},t.trigger=function(e,t,r){e.dispatchEvent(n(t,{bubbles:!0,detail:r}))}},502:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.decodeHtmlEntities=t.buildtemplates=t.createTemplateId=t.dup=t.stripTemplateTag=t.uuid=t.rAF=void 0;var o=r(n(585)),i=document.createElement("textarea");t.rAF=function(e){return requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60)},t.uuid=function(){return"xxxxxxxx".replace(/[xy]/g,(function(e){var t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)}))},t.stripTemplateTag=function(e){Array.from(e.querySelectorAll("template")).forEach((function(e){e.parentNode.replaceChild(e.content,e),(0,t.stripTemplateTag)(e.content)}))},t.dup=function(e){return JSON.parse(JSON.stringify(e))},t.createTemplateId=function(e,n){if(!e.getAttribute("tplid")){var r=(0,t.uuid)();e.setAttribute("tplid",r),n[r]=(0,o.default)(e)}},t.buildtemplates=function(e,n,r){return Array.from(e.querySelectorAll("*")).filter((function(e){return e.tagName.toLowerCase()in n})).reverse().map((function(e){return Array.from(e.querySelectorAll("template")).map((function(e){return(0,t.buildtemplates)(e.content,n,r)})),(0,t.createTemplateId)(e,r),e}))},t.decodeHtmlEntities=function(e){return i.innerHTML=e,i.value}},119:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.unsubscribe=t.subscribe=t.publish=void 0;var n={},r={};t.publish=function(e,t){r[e]=Object.assign({},r[e],t),n[e]&&n[e].forEach((function(e){return e(t)}))},t.subscribe=function(e,t){n[e]=n[e]||[],n[e].push(t),e in r&&t(r[e])},t.unsubscribe=function(e){n[e.name]=(n[e.name]||[]).filter((function(t){return t!=e.method})),n[e.name].length||(delete n[e.name],delete r[e.name])}},641:function(e,t){!function(e){"use strict";function t(e){var n,r,o=new Error(e);return n=o,r=t.prototype,Object.setPrototypeOf?Object.setPrototypeOf(n,r):n.__proto__=r,o}function n(e,n,r){var o=n.slice(0,r).split(/\n/),i=o.length,a=o[i-1].length+1;throw t(e+=" at line "+i+" col "+a+":\n\n  "+n.split(/\n/)[i-1]+"\n  "+Array(a).join(" ")+"^")}t.prototype=Object.create(Error.prototype,{name:{value:"Squirrelly Error",enumerable:!1}});var r=new Function("return this")().Promise,o=!1;try{o=new Function("return (async function(){}).constructor")()}catch(e){if(!(e instanceof SyntaxError))throw e}var i=function(e,t){return"(function(){ try{ return "+e+" }catch(err) { return "+t+"} })()"};function a(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function u(e,t,n){for(var r in t)a(t,r)&&(null==t[r]||"object"!=typeof t[r]||"storage"!==r&&"prefixes"!==r||n?e[r]=t[r]:e[r]=u({},t[r]));return e}var c=/^async +/,s=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,l=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,f=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g,d=/[.*+\-?^${}()|[\]\\]/g;function p(e){return d.test(e)?e.replace(d,"\\$&"):e}function m(e,r){r.rmWhitespace&&(e=e.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),s.lastIndex=0,l.lastIndex=0,f.lastIndex=0;var o=r.prefixes,i=[o.h,o.b,o.i,o.r,o.c,o.e].reduce((function(e,t){return e&&t?e+"|"+p(t):t?p(t):e}),""),a=new RegExp("([|()]|=>)|('|\"|`|\\/\\*)|\\s*((\\/)?(-|_)?"+p(r.tags[1])+")","g"),u=new RegExp("([^]*?)"+p(r.tags[0])+"(-|_)?\\s*("+i+")?\\s*","g"),d=0,m=!1;function v(t,o){var i,p={f:[]},v=0,h="c";function g(t){var o=e.slice(d,t),i=o.trim();if("f"===h)"safe"===i?p.raw=!0:r.async&&c.test(i)?(i=i.replace(c,""),p.f.push([i,"",!0])):p.f.push([i,""]);else if("fp"===h)p.f[p.f.length-1][1]+=i;else if("err"===h){if(i){var a=o.search(/\S/);n("invalid syntax",e,d+a)}}else p[h]=i;d=t+1}for("h"===o||"b"===o||"c"===o?h="n":"r"===o&&(p.raw=!0,o="i"),a.lastIndex=d;null!==(i=a.exec(e));){var b=i[1],y=i[2],x=i[3],_=i[4],A=i[5],N=i.index;if(b)"("===b?(0===v&&("n"===h?(g(N),h="p"):"f"===h&&(g(N),h="fp")),v++):")"===b?0==--v&&"c"!==h&&(g(N),h="err"):0===v&&"|"===b?(g(N),h="f"):"=>"===b&&(g(N),d+=1,h="res");else if(y)if("/*"===y){var T=e.indexOf("*/",a.lastIndex);-1===T&&n("unclosed comment",e,i.index),a.lastIndex=T+2}else"'"===y?(l.lastIndex=i.index,l.exec(e)?a.lastIndex=l.lastIndex:n("unclosed string",e,i.index)):'"'===y?(f.lastIndex=i.index,f.exec(e)?a.lastIndex=f.lastIndex:n("unclosed string",e,i.index)):"`"===y&&(s.lastIndex=i.index,s.exec(e)?a.lastIndex=s.lastIndex:n("unclosed string",e,i.index));else if(x)return g(N),d=N+i[0].length,u.lastIndex=d,m=A,_&&"h"===o&&(o="s"),p.t=o,p}return n("unclosed tag",e,t),p}var h=function i(a,s){a.b=[],a.d=[];var l,f=!1,p=[];function h(e,t){e&&(e=function(e,t,n,r){var o,i;return"string"==typeof t.autoTrim?o=i=t.autoTrim:Array.isArray(t.autoTrim)&&(o=t.autoTrim[1],i=t.autoTrim[0]),(n||!1===n)&&(o=n),(r||!1===r)&&(i=r),"slurp"===o&&"slurp"===i?e.trim():("_"===o||"slurp"===o?e=String.prototype.trimLeft?e.trimLeft():e.replace(/^[\s\uFEFF\xA0]+/,""):"-"!==o&&"nl"!==o||(e=e.replace(/^(?:\n|\r|\r\n)/,"")),"_"===i||"slurp"===i?e=String.prototype.trimRight?e.trimRight():e.replace(/[\s\uFEFF\xA0]+$/,""):"-"!==i&&"nl"!==i||(e=e.replace(/(?:\n|\r|\r\n)$/,"")),e)}(e,r,m,t))&&(e=e.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),p.push(e))}for(;null!==(l=u.exec(e));){var g,b=l[1],y=l[2],x=l[3]||"";for(var _ in o)if(o[_]===x){g=_;break}h(b,y),d=l.index+l[0].length,g||n("unrecognized tag type: "+x,e,d);var A=v(l.index,g),N=A.t;if("h"===N){var T=A.n||"";r.async&&c.test(T)&&(A.a=!0,A.n=T.replace(c,"")),A=i(A),p.push(A)}else if("c"===N){if(a.n===A.n)return f?(f.d=p,a.b.push(f)):a.d=p,a;n("Helper start and end don't match",e,l.index+l[0].length)}else if("b"===N){f?(f.d=p,a.b.push(f)):a.d=p;var S=A.n||"";r.async&&c.test(S)&&(A.a=!0,A.n=S.replace(c,"")),f=A,p=[]}else if("s"===N){var w=A.n||"";r.async&&c.test(w)&&(A.a=!0,A.n=w.replace(c,"")),p.push(A)}else p.push(A)}if(!s)throw t('unclosed helper "'+a.n+'"');return h(e.slice(d,e.length),!1),a.d=p,a}({f:[]},!0);if(r.plugins)for(var g=0;g<r.plugins.length;g++){var b=r.plugins[g];b.processAST&&(h.d=b.processAST(h.d,r))}return h.d}function v(e,t){var n=m(e,t),r="var tR='';"+(t.useWith?"with("+t.varName+"||{}){":"")+x(n,t)+"if(cb){cb(null,tR)} return tR"+(t.useWith?"}":"");if(t.plugins)for(var o=0;o<t.plugins.length;o++){var i=t.plugins[o];i.processFnString&&(r=i.processFnString(r,t))}return r}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n][0],o=t[n][1];e=(t[n][2]?"await ":"")+"c.l('F','"+r+"')("+e,o&&(e+=","+o),e+=")"}return e}function g(e,t,n,r,o,i){var a="{exec:"+(o?"async ":"")+y(n,t,e)+",params:["+r+"]";return i&&(a+=",name:'"+i+"'"),o&&(a+=",async:true"),a+"}"}function b(e,t){for(var n="[",r=0;r<e.length;r++){var o=e[r];n+=g(t,o.res||"",o.d,o.p||"",o.a,o.n),r<e.length&&(n+=",")}return n+"]"}function y(e,t,n){return"function("+t+"){var tR='';"+x(e,n)+"return tR}"}function x(e,t){for(var n=0,r=e.length,o="";n<r;n++){var a=e[n];if("string"==typeof a)o+="tR+='"+a+"';";else{a.c=i(a.c||"",""),a.p=i(a.p||"","");var u=a.t,c=a.c,s=a.f,l=a.n||"",f=a.p,d=a.res||"",p=a.b,m=!!a.a;if("i"===u){t.defaultFilter&&(c="c.l('F','"+t.defaultFilter+"')("+c+")");var v=h(c,s);!a.raw&&t.autoEscape&&(v="c.l('F','e')("+v+")"),o+="tR+="+v+";"}else if("h"===u)if(t.storage.nativeHelpers.get(l))o+=t.storage.nativeHelpers.get(l)(a,t);else{var y=(m?"await ":"")+"c.l('H','"+l+"')("+g(t,d,a.d,f,m);y+=p?","+b(p,t):",[]",o+="tR+="+h(y+=",c)",s)+";"}else"s"===u?o+="tR+="+h((m?"await ":"")+"c.l('H','"+l+"')({params:["+f+"]},[],c)",s)+";":"e"===u&&(o+=c+"\n")}}return o}var _=function(){function e(e){this.cache=e}return e.prototype.define=function(e,t){this.cache[e]=t},e.prototype.get=function(e){return this.cache[e]},e.prototype.remove=function(e){delete this.cache[e]},e.prototype.reset=function(){this.cache={}},e.prototype.load=function(e){u(this.cache,e,!0)},e}();function A(e,n,r,o){if(n&&n.length>0)throw t((o?"Native":"")+"Helper '"+e+"' doesn't accept blocks");if(r&&r.length>0)throw t((o?"Native":"")+"Helper '"+e+"' doesn't accept filters")}var N={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function T(e){return N[e]}var S=new _({}),w=new _({each:function(e,t){var n="",r=e.params[0];if(A("each",t,!1),e.async)return new Promise((function(t){!function e(t,n,r,o,i){r(t[n],n).then((function(a){o+=a,n===t.length-1?i(o):e(t,n+1,r,o,i)}))}(r,0,e.exec,n,t)}));for(var o=0;o<r.length;o++)n+=e.exec(r[o],o);return n},foreach:function(e,t){var n=e.params[0];if(A("foreach",t,!1),e.async)return new Promise((function(t){!function e(t,n,r,o,i,a){o(n[r],t[n[r]]).then((function(u){i+=u,r===n.length-1?a(i):e(t,n,r+1,o,i,a)}))}(n,Object.keys(n),0,e.exec,"",t)}));var r="";for(var o in n)a(n,o)&&(r+=e.exec(o,n[o]));return r},include:function(e,n,r){A("include",n,!1);var o=r.storage.templates.get(e.params[0]);if(!o)throw t('Could not fetch template "'+e.params[0]+'"');return o(e.params[1],r)},extends:function(e,n,r){var o=e.params[1]||{};o.content=e.exec();for(var i=0;i<n.length;i++){var a=n[i];o[a.name]=a.exec()}var u=r.storage.templates.get(e.params[0]);if(!u)throw t('Could not fetch template "'+e.params[0]+'"');return u(o,r)},useScope:function(e,t){return A("useScope",t,!1),e.exec(e.params[0])}}),E=new _({if:function(e,t){A("if",!1,e.f,!0);var n="if("+e.p+"){"+x(e.d,t)+"}";if(e.b)for(var r=0;r<e.b.length;r++){var o=e.b[r];"else"===o.n?n+="else{"+x(o.d,t)+"}":"elif"===o.n&&(n+="else if("+o.p+"){"+x(o.d,t)+"}")}return n},try:function(e,n){if(A("try",!1,e.f,!0),!e.b||1!==e.b.length||"catch"!==e.b[0].n)throw t("native helper 'try' only accepts 1 block, 'catch'");var r="try{"+x(e.d,n)+"}",o=e.b[0];return r+"catch"+(o.res?"("+o.res+")":"")+"{"+x(o.d,n)+"}"},block:function(e,t){return A("block",e.b,e.f,!0),"if(!"+t.varName+"["+e.p+"]){tR+=("+y(e.d,"",t)+")()}else{tR+="+t.varName+"["+e.p+"]}"}}),O=new _({e:function(e){var t=String(e);return/[&<>"']/.test(t)?t.replace(/[&<>"']/g,T):t}}),C={varName:"it",autoTrim:[!1,"nl"],autoEscape:!0,defaultFilter:!1,tags:["{{","}}"],l:function(e,n){if("H"===e){var r=this.storage.helpers.get(n);if(r)return r;throw t("Can't find helper '"+n+"'")}if("F"===e){var o=this.storage.filters.get(n);if(o)return o;throw t("Can't find filter '"+n+"'")}},async:!1,storage:{helpers:w,nativeHelpers:E,filters:O,templates:S},prefixes:{h:"@",b:"#",i:"",r:"*",c:"/",e:"!"},cache:!1,plugins:[],useWith:!1};function j(e,t){var n={};return u(n,C),t&&u(n,t),e&&u(n,e),n.l.bind(n),n}function P(e,n){var r=j(n||{}),i=Function;if(r.async){if(!o)throw t("This environment doesn't support async/await");i=o}try{return new i(r.varName,"c","cb",v(e,r))}catch(n){throw n instanceof SyntaxError?t("Bad template syntax\n\n"+n.message+"\n"+Array(n.message.length+1).join("=")+"\n"+v(e,r)):n}}function F(e,t){var n;return t.cache&&t.name&&t.storage.templates.get(t.name)?t.storage.templates.get(t.name):(n="function"==typeof e?e:P(e,t),t.cache&&t.name&&t.storage.templates.define(t.name,n),n)}C.l.bind(C),e.compile=P,e.compileScope=x,e.compileScopeIntoFunction=y,e.compileToString=v,e.defaultConfig=C,e.filters=O,e.getConfig=j,e.helpers=w,e.nativeHelpers=E,e.parse=m,e.render=function(e,n,o,i){var a=j(o||{});if(!a.async)return F(e,a)(n,a);if(!i){if("function"==typeof r)return new r((function(t,r){try{t(F(e,a)(n,a))}catch(e){r(e)}}));throw t("Please provide a callback function, this env doesn't support Promises")}try{F(e,a)(n,a,i)}catch(e){return i(e)}},e.templates=S,Object.defineProperty(e,"__esModule",{value:!0})}(t)}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}return n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(341)})()));
//# sourceMappingURL=index.js.map