!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("jails",[],t):"object"==typeof exports?exports.jails=t():e.jails=t()}(self,(function(){return(()=>{var e={17:function(e){var t;t=function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(1),a=n(2);function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var l="undefined"!=typeof document?document:{},u=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"soda-";s(this,e),this._prefix=t}return i(e,[{key:"setDocument",value:function(e){l=e}},{key:"run",value:function(e,t){var n=this,r=l.createElement("div");l.documentMode<9&&(r.style.display="none",l.body.appendChild(r)),r.innerHTML=e,(0,a.nodes2Arr)(r.childNodes).map((function(e){n.compileNode(e,t)}));var i=r.innerHTML;return l.documentMode<9&&l.body.removeChild(r),i}},{key:"prefix",value:function(e){this._prefix=e}},{key:"_getPrefixReg",value:function(){return new RegExp("^"+this._prefix)}},{key:"_getPrefixedDirectiveMap",value:function(){var t=this,n={};return e.sodaDirectives.map((function(e){var r=t._prefix+e.name;n[r]=e})),n}},{key:"_removeSodaMark",value:function(e,t){e.removeAttribute(t)}},{key:"compileNode",value:function(t,n){var i=this,s=this._getPrefixReg(),u=e.sodaDirectives,c=this._getPrefixedDirectiveMap();!function e(t,n){t.nodeType===(t.TEXT_NODE||3)&&(t.nodeValue=t.nodeValue.replace(o.VALUE_OUT_REG,(function(e,t){var o=i.parseSodaExpression(t,n);return"object"===(void 0===o?"undefined":r(o))&&(o=JSON.stringify(o,null,2)),o}))),t.attributes&&t.attributes.length&&(u.map((function(e){var r=e.name,o=e.opt,s=i._prefix+r;if((0,a.exist)(t.getAttribute(s))){var u=t.getAttribute(s);o.link.bind(i)({expression:u,scope:n,el:t,parseSodaExpression:i.parseSodaExpression.bind(i),getValue:i.getValue.bind(i),compileNode:i.compileNode.bind(i),document:l}),i._removeSodaMark(t,s)}})),(0,a.nodes2Arr)(t.attributes).filter((function(e){return!c[e.name]})).map((function(e){if(s.test(e.name)){var r=e.name.replace(s,"");if(r&&(0,a.exist)(e.value)){var o=i.parseComplexExpression(e.value,n);!1!==o&&(0,a.exist)(o)&&t.setAttribute(r,o),i._removeSodaMark(t,e.name)}}else(0,a.exist)(e.value)&&(e.value=i.parseComplexExpression(e.value,n))}))),(0,a.nodes2Arr)(t.childNodes).map((function(t){e(t,n)}))}(t,n)}},{key:"getEvalFunc",value:function(t){return new Function("getValue","sodaFilterMap","return function sodaExp(scope){ return "+t+"}")(this.getValue,e.sodaFilterMap)}},{key:"getValue",value:function(e,t){return o.CONST_REGG.lastIndex=0,t.replace(o.CONST_REGG,(function(t){return void 0===e[t]?t:e[t]})),"true"===t||"false"!==t&&function t(n,r){var i=r.indexOf(".");if(i>-1){var a=r.substr(0,i);return r=r.substr(i+1),void 0!==e[a]&&o.CONST_REG.test(a)&&(a=e[a]),void 0!==n[a]&&null!==n[a]?t(n[a],r):""}return r=r.trim(),void 0!==e[r]&&o.CONST_REG.test(r)&&(r=e[r]),void 0!==n[r]?n[r]:""}(e,t)}},{key:"parseComplexExpression",value:function(e,t){var n=this,r=o.ONLY_VALUE_OUT_REG.exec(e);if(r){var i=r[1];return this.parseSodaExpression(i,t)}return e.replace(o.VALUE_OUT_REG,(function(e,r){return n.parseSodaExpression(r,t)}))}},{key:"parseSodaExpression",value:function(e,t){var n=this;e=(e=e.replace(o.STRING_REG,(function(e,n,r){var i=(0,a.getRandom)();return t[i]=n||r,i}))).replace(o.OR_REG,o.OR_REPLACE).split("|");for(var r=0;r<e.length;r++)e[r]=(e[r].replace(new RegExp(o.OR_REPLACE,"g"),"||")||"").trim();for(var i=e[0]||"",s=e.slice(1);o.ATTR_REG_NG.test(i);)o.ATTR_REG.lastIndex=0,i=i.replace(o.ATTR_REG,(function(e,r){var i=(0,a.getAttrVarKey)(),o=n.parseSodaExpression(r,t);return t[i]=o,"."+i}));return i=i.replace(o.OBJECT_REG,(function(e){return"getValue(scope,'"+e.trim()+"')"})),i=this.parseFilter(s,i),this.getEvalFunc(i)(t)}},{key:"parseFilter",value:function(t,n){var r=e.sodaFilterMap;return function e(){if(i=t.shift()){for(var i,a=(i=i.split(":")).slice(1)||[],s=(i[0]||"").trim(),l=0;l<a.length;l++)o.OBJECT_REG_NG.test(a[l])&&(a[l]="getValue(scope,'"+a[l]+"')");r[s]&&(a.unshift(n),a=a.join(","),n="sodaFilterMap['"+s+"']("+a+")"),e()}}(),n}}],[{key:"filter",value:function(e,t){this.sodaFilterMap[e]=t}},{key:"getFilter",value:function(e){return this.sodaFilterMap[e]}},{key:"directive",value:function(e,t){var n=t.priority,r=void 0===n?0:n,i=void 0;for(i=0;i<this.sodaDirectives.length;i++){var o=this.sodaDirectives[i].opt.priority,a=void 0===o?0:o;if(r<a);else if(r>=a)break}this.sodaDirectives.splice(i,0,{name:e,opt:t})}},{key:"discribe",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{compile:!0};this.template[e]={funcOrStr:t,option:n}}},{key:"getTmpl",value:function(e,t){var n=this.template[e],r=n.funcOrStr,i=n.option,o=void 0===i?{}:i;return{template:"function"==typeof r?r.apply(null,t):r,option:o}}}]),e}();u.sodaDirectives=[],u.sodaFilterMap={},u.template={},t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.IDENTOR_REG=/[a-zA-Z_\$]+[\w\$]*/g,t.STRING_REG=/"([^"]*)"|'([^']*)'/g,t.NUMBER_REG=/\d+|\d*\.\d+/g,t.OBJECT_REG=/[a-zA-Z_\$]+[\w\$]*(?:\s*\.\s*(?:[a-zA-Z_\$]+[\w\$]*|\d+))*/g,t.OBJECT_REG_NG=/[a-zA-Z_\$]+[\w\$]*(?:\s*\.\s*(?:[a-zA-Z_\$]+[\w\$]*|\d+))*/,t.ATTR_REG=/\[([^\[\]]*)\]/g,t.ATTR_REG_NG=/\[([^\[\]]*)\]/,t.ATTR_REG_DOT=/\.([a-zA-Z_\$]+[\w\$]*)/g,t.NOT_ATTR_REG=/[^\.|]([a-zA-Z_\$]+[\w\$]*)/g,t.OR_REG=/\|\|/g,t.OR_REPLACE="OR_OPERATOR",t.CONST_PRIFIX="_$C$_",t.CONST_REG=/^_\$C\$_/,t.CONST_REGG=/_\$C\$_[^\.]+/g,t.VALUE_OUT_REG=/\{\{([^\}]*)\}\}/g,t.ONLY_VALUE_OUT_REG=/^\{\{([^\}]*)\}\}$/},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.assign=t.nodes2Arr=t.exist=t.getRandom=t.getAttrVarKey=void 0;var r=n(1),i=(t.getAttrVarKey=function(){return r.CONST_PRIFIX+~~(1e6*Math.random())},t.getRandom=function(){return"$$"+~~(1e6*Math.random())},t.exist=function(e){return null!=e&&""!==e&&void 0!==e},t.nodes2Arr=function(e){for(var t=[],n=0;n<e.length;n++)t.push(e[n]);return t},Object.getOwnPropertySymbols),o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)};t.assign=Object.assign||function(e,t){for(var n,r,l=s(e),u=1;u<arguments.length;u++){for(var c in n=Object(arguments[u]))o.call(n,c)&&(l[c]=n[c]);if(i){r=i(n);for(var d=0;d<r.length;d++)a.call(n,r[d])&&(l[r[d]]=n[r[d]])}}return l}},function(e,t,n){"use strict";var r,i=(r=n(0))&&r.__esModule?r:{default:r},o=n(2);n(4),n(5),n(6),n(7),n(8),n(9),n(10);var a=new i.default,s={prefix:function(e){a.prefix(e)},filter:function(e,t){i.default.filter(e,t)},directive:function(e,t){i.default.directive(e,t)},setDocument:function(e){a.setDocument(e)},discribe:function(e,t,n){i.default.discribe(e,t,n)},Soda:i.default},l=(0,o.assign)((function(e,t){return a.run(e,t)}),s);e.exports=l},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("repeat",{priority:10,link:function(e){var t,n,r,i=this,o=e.scope,a=e.el,s=e.expression,l=e.getValue,u=(e.parseSodaExpression,e.compileNode),c=s.replace(/\s+by\s+([^\s]+)$/,(function(e,t){return t&&(r=(t||"").trim()),""})),d=/([^\s]+)\s+in\s+([^\s]+)|\(([^,]+)\s*,\s*([^)]+)\)\s+in\s+([^\s]+)/.exec(c);if(d){if(d[1]&&d[2]){if(t=(d[1]||"").trim(),n=(d[2]||"").trim(),!t||!n)return}else d[3]&&d[4]&&d[5]&&(r=(d[3]||"").trim(),t=(d[4]||"").trim(),n=(d[5]||"").trim());r=r||"$index";var f=l(o,n)||[],p=function(e){var n=a.cloneNode(!0),s=Object.create(o);s[r]=e,s[t]=f[e],n.removeAttribute(i._prefix+"repeat"),a.parentNode.insertBefore(n,a),u(n,s)};if("length"in f)for(var v=0;v<f.length;v++)p(v);else for(var v in f)f.hasOwnProperty(v)&&p(v);a.parentNode.removeChild(a),a.childNodes&&a.childNodes.length&&(a.innerHTML="")}}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("if",{priority:9,link:function(e){var t=e.expression,n=e.parseSodaExpression,r=e.scope,i=e.el;n(t,r)||(i.parentNode&&i.parentNode.removeChild(i),i.innerHTML="")}})},function(e,t,n){"use strict";var r,i=(r=n(0))&&r.__esModule?r:{default:r};i.default.directive("class",{link:function(e){var t=e.scope,n=e.el,r=e.expression,i=(0,e.parseSodaExpression)(r,t);i&&function(e,t){e.className?e.className.match(function(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)","g")}(t))||(e.className+=" "+t):e.className=t}(n,i)}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("html",{link:function(e){var t=e.expression,n=e.scope,r=e.el,i=(0,e.parseSodaExpression)(t,n);i&&(r.innerHTML=i)}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("replace",{link:function(e){var t=e.scope,n=e.el,r=e.expression,i=e.parseSodaExpression,o=e.document,a=i(r,t);if(a){var s=o.createElement("div");if(s.innerHTML=a,n.parentNode)for(;s.childNodes[0];)n.parentNode.insertBefore(s.childNodes[0],n)}n.parentNode&&n.parentNode.removeChild(n)}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("style",{link:function(e){var t=e.scope,n=e.el,r=e.expression,i=(0,e.parseSodaExpression)(r,t),o=function(e,t){return/opacity|z-index/.test(e)?parseFloat(t):isNaN(t)?t:t+"px"};if(i){var a=[];for(var s in i)if(i.hasOwnProperty(s)){var l=o(s,i[s]);a.push([s,l].join(":"))}var u=n.style;for(s=0;s<u.length;s++){var c=u[s];i[c]||a.push([c,u[c]].join(":"))}var d=a.join(";");n.setAttribute("style",d)}}})},function(e,t,n){"use strict";var r,i=(r=n(0))&&r.__esModule?r:{default:r};i.default.directive("include",{priority:8,link:function(e){var t=e.scope,n=e.el,r=e.parseSodaExpression,o=e.expression.replace(/\{\{([^\}]*)\}\}/g,(function(e,n){return r(n,t)})),a=(o=o.split(":"))[0],s=o.slice(1),l=i.default.getTmpl(a,s),u=l.template,c=l.option;u&&((void 0===c?{}:c).compile?n.outerHTML=this.run(u,t):n.outerHTML=u)}})}])},e.exports=t()}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{"use strict";n.r(r),n.d(r,{default:()=>M});var e,t={};n.r(t),n.d(t,{publish:()=>_,subscribe:()=>g,unsubscribe:()=>y});var i="undefined"==typeof document?void 0:document,o=!!i&&"content"in i.createElement("template"),a=!!i&&i.createRange&&"createContextualFragment"in i.createRange();function s(e,t){var n,r,i=e.nodeName,o=t.nodeName;return i===o||(n=i.charCodeAt(0),r=o.charCodeAt(0),n<=90&&r>=97?i===o.toUpperCase():r<=90&&n>=97&&o===i.toUpperCase())}function l(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var u={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}l(e,t,"selected")},INPUT:function(e,t){l(e,t,"checked"),l(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var i=r.nodeValue;if(i==n||!n&&i==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,i=-1,o=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){i=o;break}o++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=i}}};function c(){}function d(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}const f=function(t,n,r){if(r||(r={}),"string"==typeof n)if("#document"===t.nodeName||"HTML"===t.nodeName||"BODY"===t.nodeName){var l=n;(n=i.createElement("html")).innerHTML=l}else f=(f=n).trim(),n=o?function(e){var t=i.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(f):a?function(t){return e||(e=i.createRange()).selectNode(i.body),e.createContextualFragment(t).childNodes[0]}(f):function(e){var t=i.createElement("body");return t.innerHTML=e,t.childNodes[0]}(f);var f,p=r.getNodeKey||d,v=r.onBeforeNodeAdded||c,m=r.onNodeAdded||c,h=r.onBeforeElUpdated||c,b=r.onElUpdated||c,_=r.onBeforeNodeDiscarded||c,g=r.onNodeDiscarded||c,y=r.onBeforeElChildrenUpdated||c,E=!0===r.childrenOnly,x=Object.create(null),N=[];function A(e){N.push(e)}function T(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=p(n))?A(r):(g(n),n.firstChild&&T(n,t)),n=n.nextSibling}}function O(e,t,n){!1!==_(e)&&(t&&t.removeChild(e),g(e),T(e,n))}function S(e){m(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=p(t);if(r){var i=x[r];i&&s(t,i)?(t.parentNode.replaceChild(i,t),R(i,t)):S(t)}else S(t);t=n}}function R(e,t,n){var r=p(t);if(r&&delete x[r],!n){if(!1===h(e,t))return;if(function(e,t){var n,r,i,o,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var s=a.length-1;s>=0;s--)r=(n=a[s]).name,i=n.namespaceURI,o=n.value,i?(r=n.localName||r,e.getAttributeNS(i,r)!==o&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(i,r,o))):e.getAttribute(r)!==o&&e.setAttribute(r,o);for(var l=e.attributes,u=l.length-1;u>=0;u--)r=(n=l[u]).name,(i=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(i,r)||e.removeAttributeNS(i,r)):t.hasAttribute(r)||e.removeAttribute(r)}}(e,t),b(e),!1===y(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,o,a,l,c=t.firstChild,d=e.firstChild;e:for(;c;){for(a=c.nextSibling,n=p(c);d;){if(o=d.nextSibling,c.isSameNode&&c.isSameNode(d)){c=a,d=o;continue e}r=p(d);var f=d.nodeType,m=void 0;if(f===c.nodeType&&(1===f?(n?n!==r&&((l=x[n])?o===l?m=!1:(e.insertBefore(l,d),r?A(r):O(d,e,!0),d=l):m=!1):r&&(m=!1),(m=!1!==m&&s(d,c))&&R(d,c)):3!==f&&8!=f||(m=!0,d.nodeValue!==c.nodeValue&&(d.nodeValue=c.nodeValue))),m){c=a,d=o;continue e}r?A(r):O(d,e,!0),d=o}if(n&&(l=x[n])&&s(l,c))e.appendChild(l),R(l,c);else{var h=v(c);!1!==h&&(h&&(c=h),c.actualize&&(c=c.actualize(e.ownerDocument||i)),e.appendChild(c),S(c))}c=a,d=o}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=p(t))?A(n):O(t,e,!0),t=r}}(e,d,r);var b=u[e.nodeName];b&&b(e,t)}(e,t):u.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=p(n);r&&(x[r]=n),e(n),n=n.nextSibling}}(t);var C,M,w=t,G=w.nodeType,j=n.nodeType;if(!E)if(1===G)1===j?s(t,n)||(g(t),w=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(t,(C=n.nodeName,(M=n.namespaceURI)&&"http://www.w3.org/1999/xhtml"!==M?i.createElementNS(M,C):i.createElement(C)))):w=n;else if(3===G||8===G){if(j===G)return w.nodeValue!==n.nodeValue&&(w.nodeValue=n.nodeValue),w;w=n}if(w===n)g(t);else{if(n.isSameNode&&n.isSameNode(w))return;if(R(w,n,E),N)for(var P=0,k=N.length;P<k;P++){var L=x[N[P]];L&&O(L,L.parentNode,!1)}}return!E&&w!==t&&t.parentNode&&(w.actualize&&(w=w.actualize(t.ownerDocument||i)),t.parentNode.replaceChild(w,t)),w};var p=n(17),v=n.n(p);const m=e=>{(requestAnimationFrame||setTimeout)(e,1e3/60)},h={},b={},_=(e,t)=>{b[e]=Object.assign({},b[e],t),h[e]&&h[e].forEach((e=>e(t)))},g=(e,t)=>{h[e]=h[e]||[],h[e].push(t),e in b&&t(b[e])},y=e=>{h[e.name]=(h[e.name]||[]).filter((t=>t!=e.method)),h[e.name].length||(delete h[e.name],delete b[e.name])},E="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},x=(e,t)=>function(n){const r=this,i=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(i.args))}))},N=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},A=(e,t,n)=>function(r){const i=this,o=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(i,[r].concat(o.args))),a!==e);)a=a.parentNode},T=(e,t,n)=>{e.dispatchEvent(E(t,{bubbles:!0,detail:n}))};var O;(O=v()).prefix("v-"),O.directive("repeat",{priority:10,link({scope:e,el:t,expression:n,getValue:r,compileNode:i}){let o,a,s;const l=n.replace(/\s+by\s+([^\s]+)$/,((e,t)=>(t&&(s=(t||"").trim()),""))),u=/([^\s]+)\s+in\s+([^\s]+)|\(([^,]+)\s*,\s*([^)]+)\)\s+in\s+([^\s]+)/.exec(l);if(!u)return;if(u[1]&&u[2]){if(o=(u[1]||"").trim(),a=(u[2]||"").trim(),!o||!a)return}else u[3]&&u[4]&&u[5]&&(s=(u[3]||"").trim(),o=(u[4]||"").trim(),a=(u[5]||"").trim());s=s||"$index";const c=r(e,a)||[],d=n=>{const r=t.cloneNode(!0),a=Object.create(e);a[s]=n,a[o]=c[n],r.removeAttribute(`${this._prefix}repeat`),t.parentNode.insertBefore(r,t),Array.from(r.querySelectorAll("[data-component]")).forEach((e=>e.setAttribute("initialState",JSON.stringify(a)))),i(r,a)};if("length"in c)for(var f=0;f<c.length;f++)d(f);else for(var f in c)c.hasOwnProperty(f)&&d(f);t.parentNode.removeChild(t),t.childNodes&&t.childNodes.length&&(t.innerHTML="")}});let S={},R=[];const C={},M={start(){w.start(),w.observe()},register(e,t,n={}){C[e]={name:e,module:t,dependencies:n}}},w={start(){var e;e=document.body,Array.from(e.querySelectorAll("template")).forEach((e=>{e.parentNode.replaceChild(e.content,e)})),w.scan(document.body,G)},scan(e,t){if(1===e.nodeType){const n=Array.from(e.querySelectorAll("[data-component]"));(e.dataset.component?[e].concat(n):n).reverse().forEach(t)}},observe(){new MutationObserver((e=>e.forEach((e=>{"childList"===e.type&&(e.addedNodes.length?Array.from(e.addedNodes).forEach((e=>w.scan(e,G))):e.removedNodes.length&&Array.from(e.removedNodes).forEach((e=>w.scan(e,w.remove))))})))).observe(document.body,{childList:!0,subtree:!0})},remove(e){const t=R.find((t=>t.element==e));t&&t.dispose()}},G=e=>{let n,r;e.getAttribute("tplid")?(n=e.getAttribute("tplid"),r=R.find((e=>e.tplid==n)).template):(n="xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)})),e.setAttribute("tplid",n),r=j(e.outerHTML));const i={tplid:n,element:e,template:r,instances:{},destroyers:[],promises:[],view:e=>e,parentUpdate:e=>null,dispose(){i.promises.length?Promise.all(i.promises).then((e=>{this.destroyers.forEach((e=>e(i)))})):this.destroyers.forEach((e=>e(i)))},model:Object.assign({},JSON.parse(e.getAttribute("initialState"))),update(t,n=!1){this.model=Object.assign({global:S},this.model,t),S=P(t),n&&this.parentUpdate(this.model);const r=JSON.parse(JSON.stringify(this.model));f(e,v()(this.template,this.view(r)),{onNodeDiscarded:e=>(w.scan(e,w.remove),!0),onBeforeElUpdated:(e,t)=>!(e.isEqualNode(t)||1==e.nodeType&&"static"in e.dataset)}),m((t=>{Array.from(e.querySelectorAll("[data-component]")).forEach((e=>{const t=JSON.parse(e.getAttribute("initialState"))||{},n=R.find((t=>t.element==e)),{global:r,parent:i,...o}=this.model;if(n){const e=Object.assign(t,{parent:o,global:S});n.update(e,!0)}}))}))}};R.push(i),e.dataset.component.split(/\s/).forEach((n=>{const r=C[n];if(!r)return void console.warn(`Jails - Module ${n} not registered`);const{module:o,dependencies:a}=r;i.model=Object.assign({},o.model,i.model);const s=function({name:e,element:t,dependencies:n,Pubsub:r,ElementInterface:i,AST:o}){const a=[];let s,l=[],u=new Promise((e=>s=e));const c={name:e,dependencies:n,elm:t,publish:r.publish,unsubscribe:r.unsubscribe,__initialize(){s(c)},main(e){u.then((t=>e().forEach((e=>e(c))))).catch((e=>console.error(e)))},expose(t){i.instances[e].methods=t},state:{set(e){if(e.constructor===Function){const t=i.model;e(t),i.update(t),l.forEach((e=>e(t)))}else i.update(e),l.forEach((t=>t(e)));return new Promise((e=>m(e)))},get:()=>i.model,subscribe(e){l.push(e)},unsubscribe(e){l=l.filter((t=>t!==e))}},destroy(e){i.destroyers.push(e)},on(e,n,r){((e,t,n,r)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=x(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:A(e,n,r),callback:r})})(t,e,n,r)},off(e,n){((e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||N(e,t)}else N(e,t)})(t,e,n)},trigger(e,n,r){n.constructor===String?T(t.querySelector(n),e,{args:r}):T(t,e,{args:n})},emit(e,n){const r=Array.prototype.slice.call(arguments);T(t,r.shift(),{args:r})},update(e){i.parentUpdate=e},get:(e,n)=>function(){m((r=>{const i=Array.prototype.slice.call(arguments),a=i.shift(),s=`[data-component*=${e}]`;if(n=n?s+n:s,Array.from(t.querySelectorAll(n)).forEach((t=>{const n=o.find((e=>e.element==t));if(n){const t=n.instances[e];t&&a in t.methods&&t.methods[a].apply(null,i)}})),t.matches(n)){const n=o.find((e=>e.element==t)).instances[e];n&&a in n.methods&&n.methods[a].apply(null,i)}}))},subscribe(e,t){a.push({name:e,method:t}),r.subscribe(e,t)}};return c}({name:n,element:e,dependencies:a,Pubsub:t,ElementInterface:i,AST:R}),l=o.default(s);l&&l.then&&i.promises.push(l),s.__initialize(),i.view=o.view||i.view,i.instances[n]={methods:{}}})),i.update()},j=e=>{const t=(e=>e.replace(/<template.*?>|<\/template>/g,""))(e),n=document.createElement("div");return n.innerHTML=t,Array.from(n.querySelectorAll("[data-component]")).forEach((e=>{const t=R.find((t=>t.tplid===e.getAttribute("tplid")));t&&(e.outerHTML=t.template)})),n.innerHTML},P=e=>(Object.assign(S,e),delete S.parent,delete S.global,S)})(),r})()}));