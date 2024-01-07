!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).jails={})}(this,(function(e){"use strict";const t=new DOMParser;const n=(e,t,n)=>{var r,o;null==(r=t.parentNode)||r.insertBefore(e,t),null==(o=t.parentNode)||o.insertBefore(n,t.nextSibling)},r=document.createElement("textarea"),o=e=>(r.innerHTML=e,r.value),i=e=>requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60),a=e=>JSON.parse(JSON.stringify(e)),s=e=>{var t,n,r,o=e.attributes;if(o)for(t=o.length-1;t>=0;t-=1)"function"==typeof e[r=o[t].name]&&(e[r]=null);if(o=e.childNodes)for(n=o.length,t=0;t<n;t+=1)s(e.childNodes[t])},l=(e,t)=>{try{return e()}catch(n){return t||""}},c={tags:["${","}"]};function u(e){const r=function(e,r){const o=new RegExp(`\\${r.tags[0]}(.+?)\\${r.tags[1]}`,"g"),i=t.parseFromString(e.replace(/<\/?template[^>]*>/g,""),"text/html");return i.querySelectorAll("[html-for], [html-if], [html-inner], [html-class], [html-model]").forEach((e=>{const t=e.getAttribute("html-foreach"),r=e.getAttribute("html-for"),o=e.getAttribute("html-if"),i=e.getAttribute("html-inner"),a=e.getAttribute("html-class"),s=r||t;if(s){const t=r?"html-for":"html-foreach",o=s.match(/(.*)\sin\s(.*)/)||"",i=o[1],a=o[2];e.removeAttribute(t),e.setAttribute("scope","");const l=document.createElement("script");l.dataset.scope="",l.type="text/html",l.text="%%_= $scope _%%",e.appendChild(l);const c=document.createTextNode(`%%_(function(){ var $index = 0; for(var $key in safe(function(){ return ${a} }) ){ var ${i} = ${a}[$key]; var $scope = JSON.stringify({ '${i}':${i}, $index: $index, $key:$key }); _%%`),u=document.createTextNode("%%_ $index++; } })() _%%");n(c,e,u)}if(o){e.removeAttribute("html-if");const t=document.createTextNode(`%%_ if ( safe(function(){ return ${o} }) ){ _%%`),r=document.createTextNode("%%_ } _%%");n(t,e,r)}i&&(e.removeAttribute("html-inner"),e.innerHTML=`%%_=${i}_%%`),a&&(e.removeAttribute("html-class"),e.className=(e.className+` %%_=${a}_%%`).trim())})),i.body.innerHTML.replace(o,"%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scope"==t?e:n?`${t}="%%_=safe(function(){ return ${n=n.replace(/^{|}$/g,"")} })_%%"`:e))}(e.outerHTML,c),i=JSON.stringify(r);return new Function("$element","safe",`\n\t\tvar $data = this;\n\t\twith( $data ){\n\t\t\tvar output=${i.replace(/%%_=(.+?)_%%/g,(function(e,t){return'"+safe(function(){return '+o(t)+';})+"'})).replace(/%%_(.+?)_%%/g,(function(e,t){return'";'+o(t)+'\noutput+="'}))};return output;\n\t\t}\n\t`)}const d=(e,t,n)=>{[].concat(e.matches&&e.matches(t)?e:[]).concat(Array.from(e.querySelectorAll(t))).reverse().forEach((e=>{e.querySelectorAll("template").forEach((e=>d(e.content,t,n))),f(e,n)}))},f=(e,t)=>{if(!e.getAttribute("tplid")){const n="xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)}));e.setAttribute("tplid",n),t[n]=u(e)}},m={},h={},p=(e,t)=>{h[e]=Object.assign({},h[e],t),m[e]&&m[e].forEach((e=>e(t)))},v=(e,t)=>(m[e]=m[e]||[],m[e].push(t),e in h&&t(h[e]),()=>{m[e]=m[e].filter((e=>e!=t))});var b;var g="http://www.w3.org/1999/xhtml",_="undefined"==typeof document?void 0:document,y=!!_&&"content"in _.createElement("template"),A=!!_&&_.createRange&&"createContextualFragment"in _.createRange();function N(e){return e=e.trim(),y?function(e){var t=_.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(e):A?function(e){return b||(b=_.createRange()).selectNode(_.body),b.createContextualFragment(e).childNodes[0]}(e):function(e){var t=_.createElement("body");return t.innerHTML=e,t.childNodes[0]}(e)}function E(e,t){var n,r,o=e.nodeName,i=t.nodeName;return o===i||(n=o.charCodeAt(0),r=i.charCodeAt(0),n<=90&&r>=97?o===i.toUpperCase():r<=90&&n>=97&&i===o.toUpperCase())}function x(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var T={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}x(e,t,"selected")},INPUT:function(e,t){x(e,t,"checked"),x(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var o=r.nodeValue;if(o==n||!n&&o==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,o=-1,i=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){o=i;break}i++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=o}}};function C(){}function S(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}var $,w=($=function(e,t){var n,r,o,i,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var s=a.length-1;s>=0;s--)r=(n=a[s]).name,o=n.namespaceURI,i=n.value,o?(r=n.localName||r,e.getAttributeNS(o,r)!==i&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(o,r,i))):e.getAttribute(r)!==i&&e.setAttribute(r,i);for(var l=e.attributes,c=l.length-1;c>=0;c--)r=(n=l[c]).name,(o=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(o,r)||e.removeAttributeNS(o,r)):t.hasAttribute(r)||e.removeAttribute(r)}},function(e,t,n){if(n||(n={}),"string"==typeof t)if("#document"===e.nodeName||"HTML"===e.nodeName||"BODY"===e.nodeName){var r=t;(t=_.createElement("html")).innerHTML=r}else t=N(t);else 11===t.nodeType&&(t=t.firstElementChild);var o=n.getNodeKey||S,i=n.onBeforeNodeAdded||C,a=n.onNodeAdded||C,s=n.onBeforeElUpdated||C,l=n.onElUpdated||C,c=n.onBeforeNodeDiscarded||C,u=n.onNodeDiscarded||C,d=n.onBeforeElChildrenUpdated||C,f=n.skipFromChildren||C,m=n.addChild||function(e,t){return e.appendChild(t)},h=!0===n.childrenOnly,p=Object.create(null),v=[];function b(e){v.push(e)}function y(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=o(n))?b(r):(u(n),n.firstChild&&y(n,t)),n=n.nextSibling}}function A(e,t,n){!1!==c(e)&&(t&&t.removeChild(e),u(e),y(e,n))}function x(e){a(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=o(t);if(r){var i=p[r];i&&E(t,i)?(t.parentNode.replaceChild(i,t),w(i,t)):x(t)}else x(t);t=n}}function w(e,t,n){var r=o(t);if(r&&delete p[r],!n){if(!1===s(e,t))return;if($(e,t),l(e),!1===d(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,a,s,l,c=f(e,t),u=t.firstChild,d=e.firstChild;e:for(;u;){for(s=u.nextSibling,n=o(u);!c&&d;){if(a=d.nextSibling,u.isSameNode&&u.isSameNode(d)){u=s,d=a;continue e}r=o(d);var h=d.nodeType,v=void 0;if(h===u.nodeType&&(1===h?(n?n!==r&&((l=p[n])?a===l?v=!1:(e.insertBefore(l,d),r?b(r):A(d,e,!0),d=l):v=!1):r&&(v=!1),(v=!1!==v&&E(d,u))&&w(d,u)):3!==h&&8!=h||(v=!0,d.nodeValue!==u.nodeValue&&(d.nodeValue=u.nodeValue))),v){u=s,d=a;continue e}r?b(r):A(d,e,!0),d=a}if(n&&(l=p[n])&&E(l,u))c||m(e,l),w(l,u);else{var g=i(u);!1!==g&&(g&&(u=g),u.actualize&&(u=u.actualize(e.ownerDocument||_)),m(e,u),x(u))}u=s,d=a}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=o(t))?b(n):A(t,e,!0),t=r}}(e,d,r);var y=T[e.nodeName];y&&y(e,t)}(e,t):T.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=o(n);r&&(p[r]=n),e(n),n=n.nextSibling}}(e);var O,M,k=e,L=k.nodeType,U=t.nodeType;if(!h)if(1===L)1===U?E(e,t)||(u(e),k=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(e,(O=t.nodeName,(M=t.namespaceURI)&&M!==g?_.createElementNS(M,O):_.createElement(O)))):k=t;else if(3===L||8===L){if(U===L)return k.nodeValue!==t.nodeValue&&(k.nodeValue=t.nodeValue),k;k=t}if(k===t)u(e);else{if(t.isSameNode&&t.isSameNode(k))return;if(w(k,t,h),v)for(var j=0,R=v.length;j<R;j++){var H=p[v[j]];H&&A(H,H.parentNode,!1)}}return!h&&k!==e&&e.parentNode&&(k.actualize&&(k=k.actualize(e.ownerDocument||_)),e.parentNode.replaceChild(k,e)),k});const O="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},M=(e,t)=>function(n){const r=this,o=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(o.args))}))},k=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},L=(e,t,n)=>function(r){const o=this,i=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(o,[r].concat(i.args))),a!==e);)a=a.parentNode},U=(e,t,n,r)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=M(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:L(e,n,r),callback:r})},j=(e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||k(e,t)}else k(e,t)},R=(e,t,n)=>{e.dispatchEvent(O(t,{bubbles:!0,detail:n}))};const H=e=>({main:e=>e,unmount:e=>e,onupdate:e=>e,view:e.view?e.view:e=>e}),P=e=>({onNodeAdded:B,onElUpdated:B,onBeforeElChildrenUpdated:F,onBeforeElUpdated:F}),F=e=>{if("html-static"in e.attributes)return!1},B=e=>(1!==e.nodeType||("scope"in e.attributes&&e.querySelectorAll("[tplid]").forEach((t=>{if(!t.___scope___){const n=e.lastElementChild;t.___scope___="scope"in n.dataset?new Function(`return ${n.text}`)():{}}})),!e.getAttribute("tplid")))&&e;function V(e,t,n,r){return class extends HTMLElement{constructor(){super();const{base:o,options:s}=function(e,{module:t,dependencies:n,templates:r,components:o}){const s=H(t),c=new Function(`return ${e.getAttribute("html-model")||"{}"}`)(),u=Object.keys(o).toString();d(e,u,r);const f=e.getAttribute("tplid"),m=f?r[f]:null,h={data:t.model?a(t.model):{}};h.data=Object.assign(h.data,c);const b={template:m,elm:e,dependencies:n,publish:p,subscribe:v,main(e){s.main=e},unmount(e){s.unmount=e},onupdate(e){s.onupdate=e},on(t,n,r){U(e,t,n,r)},off(t,n){j(e,t,n)},trigger(t,n,r){n.constructor===String?Array.from(e.querySelectorAll(n)).forEach((e=>R(e,t,{args:r}))):R(e,t,{args:n})},emit:(...t)=>{R(e,t.shift(),{args:t})},state:{set(e){if(e.constructor===Function){const t=a(h.data);e(t),b.render(t)}else b.render(e);return new Promise((e=>i((t=>i((()=>e(h.data)))))))},get:()=>a(h.data),getRaw:()=>h.data},render(t=h.data){if(!document.body.contains(e))return;h.data=Object.assign(h.data,t);const n=a(h.data),r=b.template.call(Object.assign(s.view(n),e.___scope___),e,l);w(e,r,P()),i((n=>{Array.from(e.querySelectorAll("[tplid]")).forEach((e=>{const n=Object.assign(e.base.state.getRaw(),t);e.options.onupdate(n),e.base.render(n)}))}))},innerHTML(t,n){const r=n?t:e,o=(new DOMParser).parseFromString(r.outerHTML,"text/html"),a=n||t;o.body.firstElementChild.innerHTML=a,i((e=>w(r,o.body.innerHTML,P())))}};return{base:b,options:s}}(this,{module:e,dependencies:t,templates:n,components:r});this.base=o,this.options=s,this.returns=e.default(o)}connectedCallback(){if(this.base.render(),this.returns&&this.returns.constructor===Promise)this.returns.then((e=>{if(this.base&&this.options.main){const e=this.options.main(this.base);e&&e.length&&e.forEach((e=>e(this.base)))}}));else if(this.base&&this.options.main){const e=this.options.main(this.base);e&&e.length&&e.forEach((e=>e(this.base)))}}disconnectedCallback(){this.options.unmount(this.base),i((()=>{document.body.contains(this)||(this.__events&&(this.__events=null),this.base&&(this.base.elm=null),this.base&&(this.base=null),s(this))}))}attributeChangedCallback(){}}}const q={},I={},D={templateConfig:e=>{Object.assign(c,e)},publish:p,subscribe:v,register(e,t,n={}){I[e]={name:e,module:t,dependencies:n}},start(e=document.body){const t=Object.keys(I),n=t.toString();t.length&&(d(e,n,q),z())}},z=()=>{Object.values(I).forEach((e=>{const{name:t,module:n,dependencies:r}=e;if(!customElements.get(t)){const e=V(n,r,q,I);customElements.define(t,e)}}))};e.default=D,e.html=(e,...t)=>{let n=e.raw,r="";return t.forEach(((e,t)=>{let o=n[t];Array.isArray(e)&&(e=e.join("")),r+=o,r+=e})),r+=n[n.length-1],r},Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
//# sourceMappingURL=index.js.map
