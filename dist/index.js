!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).jails={})}(this,(function(e){"use strict";const t=document.createElement("textarea"),n={scopes:{}},r=e=>(t.innerHTML=e,t.value),i=e=>requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60),o=e=>JSON.parse(JSON.stringify(e)),a=e=>{var t,n,r,i=e.attributes;if(i)for(t=i.length-1;t>=0;t-=1)"function"==typeof e[r=i[t].name]&&(e[r]=null);if(i=e.childNodes)for(n=i.length,t=0;t<n;t+=1)a(e.childNodes[t])},s=(e,t)=>{try{return e()}catch(n){return t||""}},l=new DOMParser;const d=(e,t,n)=>{var r,i;null==(r=t.parentNode)||r.insertBefore(e,t),null==(i=t.parentNode)||i.insertBefore(n,t.nextSibling)},u={tags:["${","}"]};function c(e){const t=function(e,t){const r=new RegExp(`\\${t.tags[0]}(.+?)\\${t.tags[1]}`,"g"),i=l.parseFromString(e.replace(/<\/?template[^>]*>/g,""),"text/html");return i.querySelectorAll("[html-for], [html-if], [html-inner], [html-class], [html-model]").forEach((e=>{const t=e.getAttribute("html-foreach"),r=e.getAttribute("html-for"),i=e.getAttribute("html-if"),o=e.getAttribute("html-inner"),a=e.getAttribute("html-class"),s=r||t;if(s){const t=r?"html-for":"html-foreach",i=s.match(/(.*)\sin\s(.*)/)||"",o=i[1],a=i[2];e.removeAttribute(t);const l=Array.from(e.querySelectorAll(`[tplid]:not([${t}] [tplid])`)).map((e=>{const t=e.getAttribute("tplid");return n.scopes[t]=[],t})),u=document.createTextNode(`%%_(function(){ var $index = 0; for(var $key in safe(function(){ return ${a} }) ){ var ${o} = ${a}[$key]; ${JSON.stringify(l).replace(/\"/g,"'")}.map(function(id){ if($for.scopes[id]) { $for.scopes[id][$index] = { ${o}: ${a}[$key], $index: $index, $key: $key } } }); _%%`),c=document.createTextNode("%%_ $index++;}})() _%%");d(u,e,c)}if(i){e.removeAttribute("html-if");const t=document.createTextNode(`%%_ if ( safe(function(){ return ${i} }) ){ _%%`),n=document.createTextNode("%%_ } _%%");d(t,e,n)}o&&(e.removeAttribute("html-inner"),e.innerHTML=`%%_=${o}_%%`),a&&(e.removeAttribute("html-class"),e.className=(e.className+` %%_=${a}_%%`).trim())})),i.body.innerHTML.replace(r,"%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scope"==t?e:n?`${t}="%%_=safe(function(){ return ${n=n.replace(/^{|}$/g,"")} })_%%"`:e))}(e.outerHTML,u),i=JSON.stringify(t);return new Function("$element","safe","$for",`\n\t\tvar $data = this;\n\t\twith( $data ){\n\t\t\tvar output=${i.replace(/%%_=(.+?)_%%/g,(function(e,t){return'"+safe(function(){return '+r(t)+';})+"'})).replace(/%%_(.+?)_%%/g,(function(e,t){return'";'+r(t)+'\noutput+="'}))};return output;\n\t\t}\n\t`)}const f=(e,t,n)=>{Array.from(e.querySelectorAll(t)).reverse().forEach((e=>{e.querySelectorAll("template").forEach((e=>f(e.content,t,n))),m(e,n)}))},m=(e,t)=>{if(!e.getAttribute("tplid")){const n="xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)}));e.setAttribute("tplid",n),t[n]=c(e)}},p={},h={},v=(e,t)=>{h[e]=Object.assign({},h[e],t),p[e]&&p[e].forEach((e=>e(t)))},b=(e,t)=>(p[e]=p[e]||[],p[e].push(t),e in h&&t(h[e]),()=>{p[e]=p[e].filter((e=>e!=t))});var g;var _="http://www.w3.org/1999/xhtml",y="undefined"==typeof document?void 0:document,A=!!y&&"content"in y.createElement("template"),N=!!y&&y.createRange&&"createContextualFragment"in y.createRange();function E(e){return e=e.trim(),A?function(e){var t=y.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(e):N?function(e){return g||(g=y.createRange()).selectNode(y.body),g.createContextualFragment(e).childNodes[0]}(e):function(e){var t=y.createElement("body");return t.innerHTML=e,t.childNodes[0]}(e)}function T(e,t){var n,r,i=e.nodeName,o=t.nodeName;return i===o||(n=i.charCodeAt(0),r=o.charCodeAt(0),n<=90&&r>=97?i===o.toUpperCase():r<=90&&n>=97&&o===i.toUpperCase())}function x(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var C={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}x(e,t,"selected")},INPUT:function(e,t){x(e,t,"checked"),x(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var i=r.nodeValue;if(i==n||!n&&i==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,i=-1,o=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){i=o;break}o++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=i}}};function S(){}function $(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}var O,w=(O=function(e,t){var n,r,i,o,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var s=a.length-1;s>=0;s--)r=(n=a[s]).name,i=n.namespaceURI,o=n.value,i?(r=n.localName||r,e.getAttributeNS(i,r)!==o&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(i,r,o))):e.getAttribute(r)!==o&&e.setAttribute(r,o);for(var l=e.attributes,d=l.length-1;d>=0;d--)r=(n=l[d]).name,(i=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(i,r)||e.removeAttributeNS(i,r)):t.hasAttribute(r)||e.removeAttribute(r)}},function(e,t,n){if(n||(n={}),"string"==typeof t)if("#document"===e.nodeName||"HTML"===e.nodeName||"BODY"===e.nodeName){var r=t;(t=y.createElement("html")).innerHTML=r}else t=E(t);else 11===t.nodeType&&(t=t.firstElementChild);var i=n.getNodeKey||$,o=n.onBeforeNodeAdded||S,a=n.onNodeAdded||S,s=n.onBeforeElUpdated||S,l=n.onElUpdated||S,d=n.onBeforeNodeDiscarded||S,u=n.onNodeDiscarded||S,c=n.onBeforeElChildrenUpdated||S,f=n.skipFromChildren||S,m=n.addChild||function(e,t){return e.appendChild(t)},p=!0===n.childrenOnly,h=Object.create(null),v=[];function b(e){v.push(e)}function g(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=i(n))?b(r):(u(n),n.firstChild&&g(n,t)),n=n.nextSibling}}function A(e,t,n){!1!==d(e)&&(t&&t.removeChild(e),u(e),g(e,n))}function N(e){a(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=i(t);if(r){var o=h[r];o&&T(t,o)?(t.parentNode.replaceChild(o,t),x(o,t)):N(t)}else N(t);t=n}}function x(e,t,n){var r=i(t);if(r&&delete h[r],!n){if(!1===s(e,t))return;if(O(e,t),l(e),!1===c(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,a,s,l,d=f(e),u=t.firstChild,c=e.firstChild;e:for(;u;){for(s=u.nextSibling,n=i(u);!d&&c;){if(a=c.nextSibling,u.isSameNode&&u.isSameNode(c)){u=s,c=a;continue e}r=i(c);var p=c.nodeType,v=void 0;if(p===u.nodeType&&(1===p?(n?n!==r&&((l=h[n])?a===l?v=!1:(e.insertBefore(l,c),r?b(r):A(c,e,!0),c=l):v=!1):r&&(v=!1),(v=!1!==v&&T(c,u))&&x(c,u)):3!==p&&8!=p||(v=!0,c.nodeValue!==u.nodeValue&&(c.nodeValue=u.nodeValue))),v){u=s,c=a;continue e}r?b(r):A(c,e,!0),c=a}if(n&&(l=h[n])&&T(l,u))d||m(e,l),x(l,u);else{var g=o(u);!1!==g&&(g&&(u=g),u.actualize&&(u=u.actualize(e.ownerDocument||y)),m(e,u),N(u))}u=s,c=a}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=i(t))?b(n):A(t,e,!0),t=r}}(e,c,r);var _=C[e.nodeName];_&&_(e,t)}(e,t):C.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=i(n);r&&(h[r]=n),e(n),n=n.nextSibling}}(e);var w,k,M=e,L=M.nodeType,U=t.nodeType;if(!p)if(1===L)1===U?T(e,t)||(u(e),M=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(e,(w=t.nodeName,(k=t.namespaceURI)&&k!==_?y.createElementNS(k,w):y.createElement(w)))):M=t;else if(3===L||8===L){if(U===L)return M.nodeValue!==t.nodeValue&&(M.nodeValue=t.nodeValue),M;M=t}if(M===t)u(e);else{if(t.isSameNode&&t.isSameNode(M))return;if(x(M,t,p),v)for(var j=0,R=v.length;j<R;j++){var H=h[v[j]];H&&A(H,H.parentNode,!1)}}return!p&&M!==e&&e.parentNode&&(M.actualize&&(M=M.actualize(e.ownerDocument||y)),e.parentNode.replaceChild(M,e)),M});const k="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},M=(e,t)=>function(n){const r=this,i=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(i.args))}))},L=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},U=(e,t,n)=>function(r){const i=this,o=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(i,[r].concat(o.args))),a!==e);)a=a.parentNode},j=(e,t,n,r)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=M(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:U(e,n,r),callback:r})},R=(e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||L(e,t)}else L(e,t)},H=(e,t,n)=>{e.dispatchEvent(k(t,{bubbles:!0,detail:n}))};const P=e=>({main:e=>e,unmount:e=>e,onupdate:e=>e,view:e.view?e.view:e=>e}),B=e=>({onNodeAdded:V,onElUpdated:V,onBeforeElChildrenUpdated:F,onBeforeElUpdated:F}),F=e=>{if("html-static"in e.attributes)return!1},V=e=>(1!==e.nodeType||!e.getAttribute("tplid"))&&e;function q(e,t,r,l){return class extends HTMLElement{constructor(){super();const{base:a,options:d}=function(e,{module:t,dependencies:r,templates:a,components:l}){const d=e.getAttribute("tplid"),u=P(t),c=new Function(`return ${e.getAttribute("html-model")||"{}"}`)(),m=Object.keys(l).toString();f(e,m,a);const p=d?a[d]:null,h={data:t.model?o(t.model):{}},g=n.scopes[d]&&n.scopes[d].length?n.scopes[d].shift():{};h.data=Object.assign(h.data,c);const _={template:p,elm:e,dependencies:r,publish:v,subscribe:b,main(e){u.main=e},unmount(e){u.unmount=e},onupdate(e){u.onupdate=e},on(t,n,r){j(e,t,n,r)},off(t,n){R(e,t,n)},trigger(t,n,r){n.constructor===String?Array.from(e.querySelectorAll(n)).forEach((e=>H(e,t,{args:r}))):H(e,t,{args:n})},emit:(...t)=>{H(e,t.shift(),{args:t})},state:{set(e){if(e.constructor===Function){const t=o(h.data);e(t),_.render(t)}else _.render(e);return new Promise((e=>i((t=>i((()=>e(h.data)))))))},get:()=>o(h.data),getRaw:()=>h.data},render(t=h.data){if(!document.body.contains(e))return;h.data=Object.assign(h.data,t);const r=Object.assign(o(h.data),g),a=_.template.call(u.view(r),e,s,n);w(e,a,B()),i((n=>{Array.from(e.querySelectorAll("[tplid]")).forEach((e=>{const n=Object.assign(e.base.state.getRaw(),t);e.options.onupdate(n),e.base.render(n)}))}))},innerHTML(t){const n=(new DOMParser).parseFromString(e.outerHTML,"text/html");n.body.firstElementChild.innerHTML=t,i((t=>w(e,n.body.innerHTML,B())))}};return{base:_,options:u}}(this,{module:e,dependencies:t,templates:r,components:l});this.base=a,this.options=d,this.returns=e.default(a)}connectedCallback(){if(this.base.render(),this.returns&&this.returns.constructor===Promise)this.returns.then((e=>{if(this.base&&this.options.main){const e=this.options.main(this.base);e&&e.length&&e.forEach((e=>e(this.base)))}}));else if(this.base&&this.options.main){const e=this.options.main(this.base);e&&e.length&&e.forEach((e=>e(this.base)))}}disconnectedCallback(){this.options.unmount(this.base),i((()=>{document.body.contains(this)||(this.__events&&(this.__events=null),this.base&&(this.base.elm=null),this.base&&(this.base=null),a(this))}))}attributeChangedCallback(){}}}const I={},D={},z={templateConfig:e=>{Object.assign(u,e)},publish:v,subscribe:b,register(e,t,n){D[e]={name:e,module:t,dependencies:n}},start(e=document.body){const t=Object.keys(D).toString();f(e,t,I),J()}},J=()=>{Object.values(D).forEach((e=>{const{name:t,module:n,dependencies:r}=e,i=q(n,r,I,D);customElements.define(t,i)}))};e.default=z,e.html=(e,...t)=>{let n=e.raw,r="";return t.forEach(((e,t)=>{let i=n[t];Array.isArray(e)&&(e=e.join("")),r+=i,r+=e})),r+=n[n.length-1],r},Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
//# sourceMappingURL=index.js.map
