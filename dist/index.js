!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).jails=t()}(this,(function(){"use strict";const e=new DOMParser;const t=(e,t,n)=>{var r,i;null==(r=t.parentNode)||r.insertBefore(e,t),null==(i=t.parentNode)||i.insertBefore(n,t.nextSibling)},n=e=>requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60),r=e=>JSON.parse(JSON.stringify(e)),i=e=>{var t,n,r,o=e.attributes;if(o)for(t=o.length-1;t>=0;t-=1)"function"==typeof e[r=o[t].name]&&(e[r]=null);if(o=e.childNodes)for(n=o.length,t=0;t<n;t+=1)i(e.childNodes[t])},o=(e,t)=>{try{return e()}catch(n){return t||""}},a=document.createElement("textarea"),s={tags:["${","}"]};function l(n,r,i){const o=function(n,r,i,o){const a=new RegExp(`\\${r.tags[0]}(.+?)\\${r.tags[1]}`,"g"),s=e.parseFromString(n.replace(/<\/?template[^>]*>/g,""),"text/html");return s.querySelectorAll("[html-for], [html-if], [html-inner], [html-class], [html-model]").forEach((e=>{const n=e.getAttribute("html-foreach"),r=e.getAttribute("html-for"),a=e.getAttribute("html-if"),s=e.getAttribute("html-inner"),l=e.getAttribute("html-class"),d=e.getAttribute("html-model"),u=r||n;if(d){const t=e.getAttribute("tplid");e.removeAttribute("html-model");const n=new Function(`return ${d}`)();o[t]=Object.assign(o[t]||{},n)}if(u){const n=r?"html-for":"html-foreach",o=u.match(/(.*)\sin\s(.*)/)||"",a=o[1],s=o[2];e.removeAttribute(n);const l=Array.from(e.querySelectorAll(`[tplid]:not([${n}] [tplid])`)).map((e=>{const t=e.getAttribute("tplid");return i[t]=[],t})),d=document.createTextNode(`%%_(function(){ var $index = 0; for(var $key in safe(function(){ return ${s} }) ){ var ${a} = ${s}[$key]; ${JSON.stringify(l).replace(/\"/g,"'")}.map(function(id){ if($scopes[id]) { $scopes[id][$index] = { ${a}: ${s}[$key], $index: $index, $key: $key } } }); _%%`),c=document.createTextNode("%%_ $index++}})() _%%");t(d,e,c)}if(a){e.removeAttribute("html-if");const n=document.createTextNode(`%%_ if ( safe(function(){ return ${a} }) ){ _%%`),r=document.createTextNode("%%_ } _%%");t(n,e,r)}s&&(e.removeAttribute("html-inner"),e.innerHTML=`%%_=${s}_%%`),l&&(e.removeAttribute("html-class"),e.className=(e.className+` %%_=${l}_%%`).trim())})),s.body.innerHTML.replace(a,"%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scope"==t?e:n?`${t}="%%_=safe(function(){ return ${n=n.replace(/^{|}$/g,"")} })_%%"`:e))}(n.outerHTML,s,r,i);a.innerHTML=o;const l=JSON.stringify(a.value);return new Function("$element","safe","$scopes",`\n\t\tvar $data = this;\n\t\twith( $data ){\n\t\t\tvar output=${l.replace(/%%_=(.+?)_%%/g,'"+safe(function(){return $1;})+"').replace(/%%_(.+?)_%%/g,'";$1\noutput+="')};return output;\n\t\t}\n\t`)}const d=(e,t,n,r,i)=>Array.from(e.querySelectorAll("*")).filter((e=>e.tagName.toLowerCase()in t)).reverse().map((e=>(Array.from(e.querySelectorAll("template")).map((e=>d(e.content,t,n,r,i))),u(e,n,r,i),e))),u=(e,t,n,r)=>{if(!e.getAttribute("tplid")){const i="xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)}));e.setAttribute("tplid",i),t[i]=l(e,n,r)}},c={},f={},m=(e,t)=>{f[e]=Object.assign({},f[e],t),c[e]&&c[e].forEach((e=>e(t)))},p=(e,t)=>(c[e]=c[e]||[],c[e].push(t),e in f&&t(f[e]),()=>{c[e]=c[e].filter((e=>e!=t))});var h;var v="http://www.w3.org/1999/xhtml",b="undefined"==typeof document?void 0:document,g=!!b&&"content"in b.createElement("template"),_=!!b&&b.createRange&&"createContextualFragment"in b.createRange();function A(e){return e=e.trim(),g?function(e){var t=b.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(e):_?function(e){return h||(h=b.createRange()).selectNode(b.body),h.createContextualFragment(e).childNodes[0]}(e):function(e){var t=b.createElement("body");return t.innerHTML=e,t.childNodes[0]}(e)}function N(e,t){var n,r,i=e.nodeName,o=t.nodeName;return i===o||(n=i.charCodeAt(0),r=o.charCodeAt(0),n<=90&&r>=97?i===o.toUpperCase():r<=90&&n>=97&&o===i.toUpperCase())}function y(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var E={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}y(e,t,"selected")},INPUT:function(e,t){y(e,t,"checked"),y(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var i=r.nodeValue;if(i==n||!n&&i==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,i=-1,o=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){i=o;break}o++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=i}}};function $(){}function x(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}var C,T=(C=function(e,t){var n,r,i,o,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var s=a.length-1;s>=0;s--)r=(n=a[s]).name,i=n.namespaceURI,o=n.value,i?(r=n.localName||r,e.getAttributeNS(i,r)!==o&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(i,r,o))):e.getAttribute(r)!==o&&e.setAttribute(r,o);for(var l=e.attributes,d=l.length-1;d>=0;d--)r=(n=l[d]).name,(i=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(i,r)||e.removeAttributeNS(i,r)):t.hasAttribute(r)||e.removeAttribute(r)}},function(e,t,n){if(n||(n={}),"string"==typeof t)if("#document"===e.nodeName||"HTML"===e.nodeName||"BODY"===e.nodeName){var r=t;(t=b.createElement("html")).innerHTML=r}else t=A(t);else 11===t.nodeType&&(t=t.firstElementChild);var i=n.getNodeKey||x,o=n.onBeforeNodeAdded||$,a=n.onNodeAdded||$,s=n.onBeforeElUpdated||$,l=n.onElUpdated||$,d=n.onBeforeNodeDiscarded||$,u=n.onNodeDiscarded||$,c=n.onBeforeElChildrenUpdated||$,f=n.skipFromChildren||$,m=n.addChild||function(e,t){return e.appendChild(t)},p=!0===n.childrenOnly,h=Object.create(null),g=[];function _(e){g.push(e)}function y(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=i(n))?_(r):(u(n),n.firstChild&&y(n,t)),n=n.nextSibling}}function T(e,t,n){!1!==d(e)&&(t&&t.removeChild(e),u(e),y(e,n))}function S(e){a(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=i(t);if(r){var o=h[r];o&&N(t,o)?(t.parentNode.replaceChild(o,t),w(o,t)):S(t)}else S(t);t=n}}function w(e,t,n){var r=i(t);if(r&&delete h[r],!n){if(!1===s(e,t))return;if(C(e,t),l(e),!1===c(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,a,s,l,d=f(e),u=t.firstChild,c=e.firstChild;e:for(;u;){for(s=u.nextSibling,n=i(u);!d&&c;){if(a=c.nextSibling,u.isSameNode&&u.isSameNode(c)){u=s,c=a;continue e}r=i(c);var p=c.nodeType,v=void 0;if(p===u.nodeType&&(1===p?(n?n!==r&&((l=h[n])?a===l?v=!1:(e.insertBefore(l,c),r?_(r):T(c,e,!0),c=l):v=!1):r&&(v=!1),(v=!1!==v&&N(c,u))&&w(c,u)):3!==p&&8!=p||(v=!0,c.nodeValue!==u.nodeValue&&(c.nodeValue=u.nodeValue))),v){u=s,c=a;continue e}r?_(r):T(c,e,!0),c=a}if(n&&(l=h[n])&&N(l,u))d||m(e,l),w(l,u);else{var g=o(u);!1!==g&&(g&&(u=g),u.actualize&&(u=u.actualize(e.ownerDocument||b)),m(e,u),S(u))}u=s,c=a}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=i(t))?_(n):T(t,e,!0),t=r}}(e,c,r);var A=E[e.nodeName];A&&A(e,t)}(e,t):E.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=i(n);r&&(h[r]=n),e(n),n=n.nextSibling}}(e);var O,U,k=e,L=k.nodeType,R=t.nodeType;if(!p)if(1===L)1===R?N(e,t)||(u(e),k=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(e,(O=t.nodeName,(U=t.namespaceURI)&&U!==v?b.createElementNS(U,O):b.createElement(O)))):k=t;else if(3===L||8===L){if(R===L)return k.nodeValue!==t.nodeValue&&(k.nodeValue=t.nodeValue),k;k=t}if(k===t)u(e);else{if(t.isSameNode&&t.isSameNode(k))return;if(w(k,t,p),g)for(var M=0,j=g.length;M<j;M++){var B=h[g[M]];B&&T(B,B.parentNode,!1)}}return!p&&k!==e&&e.parentNode&&(k.actualize&&(k=k.actualize(e.ownerDocument||b)),e.parentNode.replaceChild(k,e)),k});const S="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},w=(e,t)=>function(n){const r=this,i=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(i.args))}))},O=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},U=(e,t,n)=>function(r){const i=this,o=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(i,[r].concat(o.args))),a!==e);)a=a.parentNode},k=(e,t,n,r)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=w(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:U(e,n,r),callback:r})},L=(e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||O(e,t)}else O(e,t)},R=(e,t,n)=>{e.dispatchEvent(S(t,{bubbles:!0,detail:n}))};const M=e=>({main:e=>e,unmount:e=>e,onupdate:e=>e,view:e.view?e.view:e=>e}),j=e=>({onNodeAdded:P,onElUpdated:P,onBeforeElChildrenUpdated:B,onBeforeElUpdated:B}),B=e=>{if("html-static"in e.attributes)return!1},P=e=>(1!==e.nodeType||!e.getAttribute("tplid"))&&e;function V(e,t,a,s,l,u){return class extends HTMLElement{constructor(){super();const{base:i,options:c}=function(e,{module:t,dependencies:i,templates:a,components:s,$scopes:l,$initialStates:u}){const c=e.getAttribute("tplid"),f=M(t);d(e,s,a,l,u);const h=u[c]||{},v=c?a[c]:null,b={data:t.model?r(t.model):{}},g=l[c]&&l[c].length?l[c].shift():{};b.data=Object.assign(g,b.data,h);const _={template:v,elm:e,dependencies:i,publish:m,subscribe:p,main(e){f.main=e},unmount(e){f.unmount=e},onupdate(e){f.onupdate=e},on(t,n,r){k(e,t,n,r)},off(t,n){L(e,t,n)},trigger(t,n,r){n.constructor===String?Array.from(e.querySelectorAll(n)).forEach((e=>R(e,t,{args:r}))):R(e,t,{args:n})},emit:(...t)=>{R(e,t.shift(),{args:t})},state:{set(e){if(e.constructor===Function){const t=r(b.data);e(t),_.render(t)}else _.render(e);return new Promise((e=>n((t=>n((()=>e(b.data)))))))},get:()=>r(b.data),getRaw:()=>b.data},render(t=b.data){if(!document.body.contains(e))return;b.data=Object.assign(b.data,t);const i=r(b.data),a=_.template.call(f.view(i),e,o,l);T(e,a,j()),n((t=>{Array.from(e.querySelectorAll("[tplid]")).forEach((e=>{const t=Object.assign(e.base.state.getRaw(),i);e.options.onupdate(t),e.base.render(t)}))}))}};return{base:_,options:f}}(this,{module:e,dependencies:t,templates:a,components:s,$scopes:l,$initialStates:u});this.base=i,this.options=c,this.returns=e.default(i)}connectedCallback(){var e;this.base.render(),this.returns&&this.returns.constructor===Promise?this.returns.then((e=>{var t;this.base&&(null==(t=this.options.main())||t.forEach((e=>e(this.base))))})):null==(e=this.options.main())||e.forEach((e=>e(this.base)))}disconnectedCallback(){this.options.unmount(this.base),n((()=>{document.body.contains(this)||(this.__events&&(this.__events=null),this.base&&(this.base.elm=null),this.base&&(this.base=null),i(this))}))}attributeChangedCallback(){}}}const q={},F={},H={},I={},D={templateConfig:e=>{Object.assign(s,e)},publish:m,subscribe:p,register(e,t,n){F[e]={name:e,module:t,dependencies:n}},start(e=document.body){d(e,F,q,H,I),z()}},z=()=>{Object.values(F).forEach((e=>{const{name:t,module:n,dependencies:r}=e,i=V(n,r,q,F,H,I);customElements.define(t,i)}))};return D}));
//# sourceMappingURL=index.js.map
