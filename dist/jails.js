!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("jails",[],t):"object"==typeof exports?exports.jails=t():e.jails=t()}(self,(function(){return(()=>{var e={492:(e,t,n)=>{"use strict";var r;n.r(t),n.d(t,{default:()=>f});var i="undefined"==typeof document?void 0:document,o=!!i&&"content"in i.createElement("template"),a=!!i&&i.createRange&&"createContextualFragment"in i.createRange();function s(e,t){var n,r,i=e.nodeName,o=t.nodeName;return i===o||(n=i.charCodeAt(0),r=o.charCodeAt(0),n<=90&&r>=97?i===o.toUpperCase():r<=90&&n>=97&&o===i.toUpperCase())}function u(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var l={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}u(e,t,"selected")},INPUT:function(e,t){u(e,t,"checked"),u(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var i=r.nodeValue;if(i==n||!n&&i==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,i=-1,o=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){i=o;break}o++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=i}}};function c(){}function d(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}const f=function(e,t,n){if(n||(n={}),"string"==typeof t)if("#document"===e.nodeName||"HTML"===e.nodeName||"BODY"===e.nodeName){var u=t;(t=i.createElement("html")).innerHTML=u}else f=(f=t).trim(),t=o?function(e){var t=i.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(f):a?function(e){return r||(r=i.createRange()).selectNode(i.body),r.createContextualFragment(e).childNodes[0]}(f):function(e){var t=i.createElement("body");return t.innerHTML=e,t.childNodes[0]}(f);var f,p=n.getNodeKey||d,v=n.onBeforeNodeAdded||c,m=n.onNodeAdded||c,_=n.onBeforeElUpdated||c,h=n.onElUpdated||c,b=n.onBeforeNodeDiscarded||c,y=n.onNodeDiscarded||c,g=n.onBeforeElChildrenUpdated||c,E=!0===n.childrenOnly,x=Object.create(null),N=[];function T(e){N.push(e)}function O(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=p(n))?T(r):(y(n),n.firstChild&&O(n,t)),n=n.nextSibling}}function A(e,t,n){!1!==b(e)&&(t&&t.removeChild(e),y(e),O(e,n))}function S(e){m(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=p(t);if(r){var i=x[r];i&&s(t,i)?(t.parentNode.replaceChild(i,t),R(i,t)):S(t)}else S(t);t=n}}function R(e,t,n){var r=p(t);if(r&&delete x[r],!n){if(!1===_(e,t))return;if(function(e,t){var n,r,i,o,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var s=a.length-1;s>=0;s--)r=(n=a[s]).name,i=n.namespaceURI,o=n.value,i?(r=n.localName||r,e.getAttributeNS(i,r)!==o&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(i,r,o))):e.getAttribute(r)!==o&&e.setAttribute(r,o);for(var u=e.attributes,l=u.length-1;l>=0;l--)r=(n=u[l]).name,(i=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(i,r)||e.removeAttributeNS(i,r)):t.hasAttribute(r)||e.removeAttribute(r)}}(e,t),h(e),!1===g(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,o,a,u,c=t.firstChild,d=e.firstChild;e:for(;c;){for(a=c.nextSibling,n=p(c);d;){if(o=d.nextSibling,c.isSameNode&&c.isSameNode(d)){c=a,d=o;continue e}r=p(d);var f=d.nodeType,m=void 0;if(f===c.nodeType&&(1===f?(n?n!==r&&((u=x[n])?o===u?m=!1:(e.insertBefore(u,d),r?T(r):A(d,e,!0),d=u):m=!1):r&&(m=!1),(m=!1!==m&&s(d,c))&&R(d,c)):3!==f&&8!=f||(m=!0,d.nodeValue!==c.nodeValue&&(d.nodeValue=c.nodeValue))),m){c=a,d=o;continue e}r?T(r):A(d,e,!0),d=o}if(n&&(u=x[n])&&s(u,c))e.appendChild(u),R(u,c);else{var _=v(c);!1!==_&&(_&&(c=_),c.actualize&&(c=c.actualize(e.ownerDocument||i)),e.appendChild(c),S(c))}c=a,d=o}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=p(t))?T(n):A(t,e,!0),t=r}}(e,d,r);var h=l[e.nodeName];h&&h(e,t)}(e,t):l.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=p(n);r&&(x[r]=n),e(n),n=n.nextSibling}}(e);var C,M,w=e,j=w.nodeType,P=t.nodeType;if(!E)if(1===j)1===P?s(e,t)||(y(e),w=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(e,(C=t.nodeName,(M=t.namespaceURI)&&"http://www.w3.org/1999/xhtml"!==M?i.createElementNS(M,C):i.createElement(C)))):w=t;else if(3===j||8===j){if(P===j)return w.nodeValue!==t.nodeValue&&(w.nodeValue=t.nodeValue),w;w=t}if(w===t)y(e);else{if(t.isSameNode&&t.isSameNode(w))return;if(R(w,t,E),N)for(var G=0,k=N.length;G<k;G++){var L=x[N[G]];L&&A(L,L.parentNode,!1)}}return!E&&w!==e&&e.parentNode&&(w.actualize&&(w=w.actualize(e.ownerDocument||i)),e.parentNode.replaceChild(w,e)),w}},17:function(e){var t;t=function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(1),a=n(2);function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var u="undefined"!=typeof document?document:{},l=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"soda-";s(this,e),this._prefix=t}return i(e,[{key:"setDocument",value:function(e){u=e}},{key:"run",value:function(e,t){var n=this,r=u.createElement("div");u.documentMode<9&&(r.style.display="none",u.body.appendChild(r)),r.innerHTML=e,(0,a.nodes2Arr)(r.childNodes).map((function(e){n.compileNode(e,t)}));var i=r.innerHTML;return u.documentMode<9&&u.body.removeChild(r),i}},{key:"prefix",value:function(e){this._prefix=e}},{key:"_getPrefixReg",value:function(){return new RegExp("^"+this._prefix)}},{key:"_getPrefixedDirectiveMap",value:function(){var t=this,n={};return e.sodaDirectives.map((function(e){var r=t._prefix+e.name;n[r]=e})),n}},{key:"_removeSodaMark",value:function(e,t){e.removeAttribute(t)}},{key:"compileNode",value:function(t,n){var i=this,s=this._getPrefixReg(),l=e.sodaDirectives,c=this._getPrefixedDirectiveMap();!function e(t,n){t.nodeType===(t.TEXT_NODE||3)&&(t.nodeValue=t.nodeValue.replace(o.VALUE_OUT_REG,(function(e,t){var o=i.parseSodaExpression(t,n);return"object"===(void 0===o?"undefined":r(o))&&(o=JSON.stringify(o,null,2)),o}))),t.attributes&&t.attributes.length&&(l.map((function(e){var r=e.name,o=e.opt,s=i._prefix+r;if((0,a.exist)(t.getAttribute(s))){var l=t.getAttribute(s);o.link.bind(i)({expression:l,scope:n,el:t,parseSodaExpression:i.parseSodaExpression.bind(i),getValue:i.getValue.bind(i),compileNode:i.compileNode.bind(i),document:u}),i._removeSodaMark(t,s)}})),(0,a.nodes2Arr)(t.attributes).filter((function(e){return!c[e.name]})).map((function(e){if(s.test(e.name)){var r=e.name.replace(s,"");if(r&&(0,a.exist)(e.value)){var o=i.parseComplexExpression(e.value,n);!1!==o&&(0,a.exist)(o)&&t.setAttribute(r,o),i._removeSodaMark(t,e.name)}}else(0,a.exist)(e.value)&&(e.value=i.parseComplexExpression(e.value,n))}))),(0,a.nodes2Arr)(t.childNodes).map((function(t){e(t,n)}))}(t,n)}},{key:"getEvalFunc",value:function(t){return new Function("getValue","sodaFilterMap","return function sodaExp(scope){ return "+t+"}")(this.getValue,e.sodaFilterMap)}},{key:"getValue",value:function(e,t){return o.CONST_REGG.lastIndex=0,t.replace(o.CONST_REGG,(function(t){return void 0===e[t]?t:e[t]})),"true"===t||"false"!==t&&function t(n,r){var i=r.indexOf(".");if(i>-1){var a=r.substr(0,i);return r=r.substr(i+1),void 0!==e[a]&&o.CONST_REG.test(a)&&(a=e[a]),void 0!==n[a]&&null!==n[a]?t(n[a],r):""}return r=r.trim(),void 0!==e[r]&&o.CONST_REG.test(r)&&(r=e[r]),void 0!==n[r]?n[r]:""}(e,t)}},{key:"parseComplexExpression",value:function(e,t){var n=this,r=o.ONLY_VALUE_OUT_REG.exec(e);if(r){var i=r[1];return this.parseSodaExpression(i,t)}return e.replace(o.VALUE_OUT_REG,(function(e,r){return n.parseSodaExpression(r,t)}))}},{key:"parseSodaExpression",value:function(e,t){var n=this;e=(e=e.replace(o.STRING_REG,(function(e,n,r){var i=(0,a.getRandom)();return t[i]=n||r,i}))).replace(o.OR_REG,o.OR_REPLACE).split("|");for(var r=0;r<e.length;r++)e[r]=(e[r].replace(new RegExp(o.OR_REPLACE,"g"),"||")||"").trim();for(var i=e[0]||"",s=e.slice(1);o.ATTR_REG_NG.test(i);)o.ATTR_REG.lastIndex=0,i=i.replace(o.ATTR_REG,(function(e,r){var i=(0,a.getAttrVarKey)(),o=n.parseSodaExpression(r,t);return t[i]=o,"."+i}));return i=i.replace(o.OBJECT_REG,(function(e){return"getValue(scope,'"+e.trim()+"')"})),i=this.parseFilter(s,i),this.getEvalFunc(i)(t)}},{key:"parseFilter",value:function(t,n){var r=e.sodaFilterMap;return function e(){if(i=t.shift()){for(var i,a=(i=i.split(":")).slice(1)||[],s=(i[0]||"").trim(),u=0;u<a.length;u++)o.OBJECT_REG_NG.test(a[u])&&(a[u]="getValue(scope,'"+a[u]+"')");r[s]&&(a.unshift(n),a=a.join(","),n="sodaFilterMap['"+s+"']("+a+")"),e()}}(),n}}],[{key:"filter",value:function(e,t){this.sodaFilterMap[e]=t}},{key:"getFilter",value:function(e){return this.sodaFilterMap[e]}},{key:"directive",value:function(e,t){var n=t.priority,r=void 0===n?0:n,i=void 0;for(i=0;i<this.sodaDirectives.length;i++){var o=this.sodaDirectives[i].opt.priority,a=void 0===o?0:o;if(r<a);else if(r>=a)break}this.sodaDirectives.splice(i,0,{name:e,opt:t})}},{key:"discribe",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{compile:!0};this.template[e]={funcOrStr:t,option:n}}},{key:"getTmpl",value:function(e,t){var n=this.template[e],r=n.funcOrStr,i=n.option,o=void 0===i?{}:i;return{template:"function"==typeof r?r.apply(null,t):r,option:o}}}]),e}();l.sodaDirectives=[],l.sodaFilterMap={},l.template={},t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.IDENTOR_REG=/[a-zA-Z_\$]+[\w\$]*/g,t.STRING_REG=/"([^"]*)"|'([^']*)'/g,t.NUMBER_REG=/\d+|\d*\.\d+/g,t.OBJECT_REG=/[a-zA-Z_\$]+[\w\$]*(?:\s*\.\s*(?:[a-zA-Z_\$]+[\w\$]*|\d+))*/g,t.OBJECT_REG_NG=/[a-zA-Z_\$]+[\w\$]*(?:\s*\.\s*(?:[a-zA-Z_\$]+[\w\$]*|\d+))*/,t.ATTR_REG=/\[([^\[\]]*)\]/g,t.ATTR_REG_NG=/\[([^\[\]]*)\]/,t.ATTR_REG_DOT=/\.([a-zA-Z_\$]+[\w\$]*)/g,t.NOT_ATTR_REG=/[^\.|]([a-zA-Z_\$]+[\w\$]*)/g,t.OR_REG=/\|\|/g,t.OR_REPLACE="OR_OPERATOR",t.CONST_PRIFIX="_$C$_",t.CONST_REG=/^_\$C\$_/,t.CONST_REGG=/_\$C\$_[^\.]+/g,t.VALUE_OUT_REG=/\{\{([^\}]*)\}\}/g,t.ONLY_VALUE_OUT_REG=/^\{\{([^\}]*)\}\}$/},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.assign=t.nodes2Arr=t.exist=t.getRandom=t.getAttrVarKey=void 0;var r=n(1),i=(t.getAttrVarKey=function(){return r.CONST_PRIFIX+~~(1e6*Math.random())},t.getRandom=function(){return"$$"+~~(1e6*Math.random())},t.exist=function(e){return null!=e&&""!==e&&void 0!==e},t.nodes2Arr=function(e){for(var t=[],n=0;n<e.length;n++)t.push(e[n]);return t},Object.getOwnPropertySymbols),o=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)};t.assign=Object.assign||function(e,t){for(var n,r,u=s(e),l=1;l<arguments.length;l++){for(var c in n=Object(arguments[l]))o.call(n,c)&&(u[c]=n[c]);if(i){r=i(n);for(var d=0;d<r.length;d++)a.call(n,r[d])&&(u[r[d]]=n[r[d]])}}return u}},function(e,t,n){"use strict";var r,i=(r=n(0))&&r.__esModule?r:{default:r},o=n(2);n(4),n(5),n(6),n(7),n(8),n(9),n(10);var a=new i.default,s={prefix:function(e){a.prefix(e)},filter:function(e,t){i.default.filter(e,t)},directive:function(e,t){i.default.directive(e,t)},setDocument:function(e){a.setDocument(e)},discribe:function(e,t,n){i.default.discribe(e,t,n)},Soda:i.default},u=(0,o.assign)((function(e,t){return a.run(e,t)}),s);e.exports=u},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("repeat",{priority:10,link:function(e){var t,n,r,i=this,o=e.scope,a=e.el,s=e.expression,u=e.getValue,l=(e.parseSodaExpression,e.compileNode),c=s.replace(/\s+by\s+([^\s]+)$/,(function(e,t){return t&&(r=(t||"").trim()),""})),d=/([^\s]+)\s+in\s+([^\s]+)|\(([^,]+)\s*,\s*([^)]+)\)\s+in\s+([^\s]+)/.exec(c);if(d){if(d[1]&&d[2]){if(t=(d[1]||"").trim(),n=(d[2]||"").trim(),!t||!n)return}else d[3]&&d[4]&&d[5]&&(r=(d[3]||"").trim(),t=(d[4]||"").trim(),n=(d[5]||"").trim());r=r||"$index";var f=u(o,n)||[],p=function(e){var n=a.cloneNode(!0),s=Object.create(o);s[r]=e,s[t]=f[e],n.removeAttribute(i._prefix+"repeat"),a.parentNode.insertBefore(n,a),l(n,s)};if("length"in f)for(var v=0;v<f.length;v++)p(v);else for(var v in f)f.hasOwnProperty(v)&&p(v);a.parentNode.removeChild(a),a.childNodes&&a.childNodes.length&&(a.innerHTML="")}}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("if",{priority:9,link:function(e){var t=e.expression,n=e.parseSodaExpression,r=e.scope,i=e.el;n(t,r)||(i.parentNode&&i.parentNode.removeChild(i),i.innerHTML="")}})},function(e,t,n){"use strict";var r,i=(r=n(0))&&r.__esModule?r:{default:r};i.default.directive("class",{link:function(e){var t=e.scope,n=e.el,r=e.expression,i=(0,e.parseSodaExpression)(r,t);i&&function(e,t){e.className?e.className.match(function(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)","g")}(t))||(e.className+=" "+t):e.className=t}(n,i)}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("html",{link:function(e){var t=e.expression,n=e.scope,r=e.el,i=(0,e.parseSodaExpression)(t,n);i&&(r.innerHTML=i)}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("replace",{link:function(e){var t=e.scope,n=e.el,r=e.expression,i=e.parseSodaExpression,o=e.document,a=i(r,t);if(a){var s=o.createElement("div");if(s.innerHTML=a,n.parentNode)for(;s.childNodes[0];)n.parentNode.insertBefore(s.childNodes[0],n)}n.parentNode&&n.parentNode.removeChild(n)}})},function(e,t,n){"use strict";var r;((r=n(0))&&r.__esModule?r:{default:r}).default.directive("style",{link:function(e){var t=e.scope,n=e.el,r=e.expression,i=(0,e.parseSodaExpression)(r,t),o=function(e,t){return/opacity|z-index/.test(e)?parseFloat(t):isNaN(t)?t:t+"px"};if(i){var a=[];for(var s in i)if(i.hasOwnProperty(s)){var u=o(s,i[s]);a.push([s,u].join(":"))}var l=n.style;for(s=0;s<l.length;s++){var c=l[s];i[c]||a.push([c,l[c]].join(":"))}var d=a.join(";");n.setAttribute("style",d)}}})},function(e,t,n){"use strict";var r,i=(r=n(0))&&r.__esModule?r:{default:r};i.default.directive("include",{priority:8,link:function(e){var t=e.scope,n=e.el,r=e.parseSodaExpression,o=e.expression.replace(/\{\{([^\}]*)\}\}/g,(function(e,n){return r(n,t)})),a=(o=o.split(":"))[0],s=o.slice(1),u=i.default.getTmpl(a,s),l=u.template,c=u.option;l&&((void 0===c?{}:c).compile?n.outerHTML=this.run(l,t):n.outerHTML=l)}})}])},e.exports=t()},126:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Component=void 0;var r=n(436),i=n(242),o=n(624);t.Component=function(e){var t,n=e.name,a=e.element,s=e.dependencies,u=e.ElementInterface,l=[],c=[],d=new Promise((function(e){return t=e})),f={name:n,dependencies:s,elm:a,publish:r.publish,unsubscribe:r.unsubscribe,__initialize:function(){t(f)},main:function(e){d.then((function(t){return e().forEach((function(e){return e(f)}))})).catch((function(e){return console.error(e)}))},expose:function(e){u.instances[n].methods=e},state:{set:function(e){if(e.constructor===Function){var t=u.model;e(t),u.update(t)}else u.update(e);return c.forEach((function(e){return e(u.model)})),new Promise((function(e){return(0,o.rAF)((function(t){return(0,o.rAF)(e)}))}))},get:function(){return u.model},subscribe:function(e){c.push(e)},unsubscribe:function(e){c=c.filter((function(t){return t!==e}))}},destroy:function(e){u.destroyers.push(e)},on:function(e,t,n){(0,i.on)(a,e,t,n)},off:function(e,t){(0,i.off)(a,e,t)},trigger:function(e,t,n){t.constructor===String?(0,i.trigger)(a.querySelector(t),e,{args:n}):(0,i.trigger)(a,e,{args:t})},emit:function(e,t){var n=Array.prototype.slice.call(arguments);(0,i.trigger)(a,n.shift(),{args:n})},update:function(e){u.parentUpdate=e},get:function(e,t){return function(){(0,o.rAF)((function(n){var r=Array.prototype.slice.call(arguments),i=r.shift(),o="[data-component*=".concat(e,"]");if(t=t?o+t:o,Array.from(a.querySelectorAll(t)).forEach((function(t){var n=t.__instance__.instances[e];n&&i in n.methods&&n.methods[i].apply(null,r)})),a.matches(t)){var s=a.__instance__.instances[e];s&&i in s.methods&&s.methods[i].apply(null,r)}}))}},subscribe:function(e,t){l.push({name:e,method:t}),r.subscribe(e,t)}};return f}},491:function(e,t,n){"use strict";var r=this&&this.__rest||function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n};Object.defineProperty(t,"__esModule",{value:!0}),t.Element=void 0;var i=n(624),o=n(492),a=(0,n(539).setSodaConfig)(),s={};t.Element=function(e){(0,i.stripTemplateTag)(e);var t=[],n=Object.assign({},JSON.parse(e.dataset.initialState||"{}")),s=u(e),l=c(e),d=l.template,f={tplid:l.tplid,el:e,template:d,model:n,parent:{},view:function(e){return e},instances:{},destroyers:[],promises:[],parentUpdate:function(e){return null},dispose:function(){f.promises.length?Promise.all(f.promises).then((function(e){return f.destroyers.forEach((function(e){return e(f)}))})):f.destroyers.forEach((function(e){return e(f)}))},update:function(n,u){void 0===n&&(n={}),document.body.contains(e)&&(t.push(n),(0,i.rAF)((function(n){if(t.length){var l={};t.forEach((function(e){return Object.assign(l,e)})),t=[],f.model=Object.assign(f.model,l),u&&f.parentUpdate(f.model);var c=a(d,f.view((0,i.dup)(f.model)));(0,o.default)(e,c,s),Array.from(e.querySelectorAll("[data-component]")).forEach((function(e){if(e.__instance__){var t=f.model,n=(t.parent,r(t,["parent"])),i=e.dataset.initialState?JSON.parse(e.dataset.initialState):{},o=Object.assign(i,{parent:n});e.__instance__.update(o,!0)}}))}})))}};return e.__instance__=f,f};var u=function(e){return{onBeforeElUpdated:l(e),onBeforeElChildrenUpdated:l(e),getNodeKey:function(e){return!(1!==e.nodeType||!e.dataset.tplid)&&(e.dataset.key||e.dataset.tplid)}}},l=function(e){return function(e,t){return!(e.isEqualNode(t)||1==e.nodeType&&"static"in e.dataset)}},c=function(e){if(e.getAttribute("tplid"))return{tplid:t=e.getAttribute("tplid"),template:s[t]};var t=(0,i.uuid)();return e.setAttribute("tplid",t),s[t]=(0,i.createTemplate)(e.outerHTML,s),{tplid:t,template:s[t]}}},610:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Scanner=void 0,t.Scanner={scan:function(e,t){if(1===e.nodeType){var n=Array.from(e.querySelectorAll("[data-component]")),r=e.dataset.component?[e].concat(n):n;r.length&&r.reverse().forEach(t)}},observe:function(e,n,r){new MutationObserver((function(e){return e.forEach((function(e){"childList"===e.type&&(e.addedNodes.length?Array.from(e.addedNodes).forEach((function(e){return t.Scanner.scan(e,n)})):e.removedNodes.length&&Array.from(e.removedNodes).forEach((function(e){return t.Scanner.scan(e,r)})))}))})).observe(e,{childList:!0,subtree:!0})}}},539:(e,t,n)=>{"use strict";n.r(t),n.d(t,{setSodaConfig:()=>o});var r=n(17),i=n.n(r);const o=()=>(i().prefix("v-"),i().directive("repeat",{priority:10,link({scope:e,el:t,expression:n,getValue:r,compileNode:i}){let o,a,s;const u=n.replace(/\s+by\s+([^\s]+)$/,((e,t)=>(t&&(s=(t||"").trim()),""))),l=/([^\s]+)\s+in\s+([^\s]+)|\(([^,]+)\s*,\s*([^)]+)\)\s+in\s+([^\s]+)/.exec(u);if(!l)return;if(l[1]&&l[2]){if(o=(l[1]||"").trim(),a=(l[2]||"").trim(),!o||!a)return}else l[3]&&l[4]&&l[5]&&(s=(l[3]||"").trim(),o=(l[4]||"").trim(),a=(l[5]||"").trim());s=s||"$index";const c=r(e,a)||[],d=n=>{const r=t.cloneNode(!0),a=Object.create(e);a[s]=n,a[o]=c[n],r.removeAttribute(`${this._prefix}repeat`),t.parentNode.insertBefore(r,t),Array.from(r.querySelectorAll("[data-component]")).forEach((e=>e.setAttribute("data-initial-state",JSON.stringify(a)))),i(r,a)};if("length"in c)for(var f=0;f<c.length;f++)d(f);else for(var f in c)c.hasOwnProperty(f)&&d(f);t.parentNode.removeChild(t),t.childNodes&&t.childNodes.length&&(t.innerHTML="")}}),i())},242:(e,t,n)=>{"use strict";n.r(t),n.d(t,{on:()=>s,off:()=>u,trigger:()=>l});const r="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},i=(e,t)=>function(n){const r=this,i=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(i.args))}))},o=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},a=(e,t,n)=>function(r){const i=this,o=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(i,[r].concat(o.args))),a!==e);)a=a.parentNode},s=(e,t,n,r)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=i(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:a(e,n,r),callback:r})},u=(e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||o(e,t)}else o(e,t)},l=(e,t,n)=>{e.dispatchEvent(r(t,{bubbles:!0,detail:n}))}},624:(e,t,n)=>{"use strict";n.r(t),n.d(t,{rAF:()=>r,uuid:()=>i,stripTemplateTag:()=>o,dup:()=>a,createTemplate:()=>s});const r=e=>{(requestAnimationFrame||setTimeout)(e,1e3/60)},i=()=>"xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)})),o=e=>{Array.from(e.querySelectorAll("template")).forEach((e=>{e.parentNode.replaceChild(e.content,e)}))},a=e=>JSON.parse(JSON.stringify(e)),s=(e,t)=>{const n=document.createElement("div");return n.innerHTML=e,o(n),Array.from(n.querySelectorAll("[data-component]")).forEach((e=>{const n=e.getAttribute("tplid"),r=t[n];r&&(e.outerHTML=r)})),n.innerHTML}},436:(e,t,n)=>{"use strict";n.r(t),n.d(t,{publish:()=>o,subscribe:()=>a,unsubscribe:()=>s});const r={},i={},o=(e,t)=>{i[e]=Object.assign({},i[e],t),r[e]&&r[e].forEach((e=>e(t)))},a=(e,t)=>{r[e]=r[e]||[],r[e].push(t),e in i&&t(i[e])},s=e=>{r[e.name]=(r[e.name]||[]).filter((t=>t!=e.method)),r[e.name].length||(delete r[e.name],delete i[e.name])}}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{"use strict";var e=r;Object.defineProperty(e,"__esModule",{value:!0});var t=n(491),i=n(610),o=n(126),a=n(624),s={};e.default={start:function(){var e=document.body;(0,a.stripTemplateTag)(e),i.Scanner.scan(e,u),i.Scanner.observe(e,u,l)},register:function(e,t,n){void 0===n&&(n={}),s[e]={name:e,module:t,dependencies:n}}};var u=function(e){var n=(0,t.Element)(e);e.dataset.component.split(/\s/).forEach((function(t){var r=s[t];if(r){var i=r.module,a=r.dependencies;n.model=Object.assign({},i.model,n.model);var u=(0,o.Component)({name:t,element:e,dependencies:a,ElementInterface:n}),l=i.default(u);l&&l.then&&n.promises.push(l),u.__initialize(),n.view=i.view||n.view,n.instances[t]={methods:{}}}else console.warn("Jails - Module ".concat(t," not registered"))})),n.update()},l=function(e){e.__instance__&&e.__instance__.dispose()}})(),r})()}));
//# sourceMappingURL=jails.js.map