!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).jails=t()}(this,(function(){"use strict";const e=new DOMParser;const t=(e,t,n)=>{var r,i;null==(r=t.parentNode)||r.insertBefore(e,t),null==(i=t.parentNode)||i.insertBefore(n,t.nextSibling)},n=e=>requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60),r=e=>JSON.parse(JSON.stringify(e)),i=e=>{var t,n,r,o=e.attributes;if(o)for(t=o.length-1;t>=0;t-=1)"function"==typeof e[r=o[t].name]&&(e[r]=null);if(o=e.childNodes)for(n=o.length,t=0;t<n;t+=1)i(e.childNodes[t])},o=(e,t)=>{try{return e()}catch(n){return t||""}},a=document.createElement("textarea"),s={tags:["${","}"]};function l(n,r){const i=function(n,r,i){const o=new RegExp(`\\${r.tags[0]}(.+?)\\${r.tags[1]}`,"g"),a=e.parseFromString(n.replace(/<\/?template[^>]*>/g,""),"text/html");return a.querySelectorAll("[html-for], [html-if], [html-inner], [html-class]").forEach((e=>{const n=e.getAttribute("html-foreach"),r=e.getAttribute("html-for"),o=e.getAttribute("html-if"),a=e.getAttribute("html-inner"),s=e.getAttribute("html-class"),l=r||n;if(l){const n=r?"html-for":"html-foreach",o=l.match(/(.*)\sin\s(.*)/)||"",a=o[1],s=o[2];e.removeAttribute(n);const d=Array.from(e.querySelectorAll(`[tplid]:not([${n}] [tplid])`)).map((e=>{const t=e.getAttribute("tplid");return i[t]=[],t})),u=document.createTextNode(`%%_(function(){ var $index = 0; for(var $key in safe(function(){ return ${s} }) ){ var ${a} = ${s}[$key]; ${JSON.stringify(d).replace(/\"/g,"'")}.map(function(id){ if($scopes[id]) { $scopes[id][$index] = { ${a}: ${s}[$key], $index: $index, $key: $key } } }); _%%`),c=document.createTextNode("%%_ $index++}})() _%%");t(u,e,c)}if(o){e.removeAttribute("html-if");const n=document.createTextNode(`%%_ if ( safe(function(){ return ${o} }) ){ _%%`),r=document.createTextNode("%%_ } _%%");t(n,e,r)}a&&(e.removeAttribute("html-inner"),e.innerHTML=`%%_=${a}_%%`),s&&(e.removeAttribute("html-class"),e.className=(e.className+` %%_=${s}_%%`).trim())})),a.body.innerHTML.replace(o,"%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scope"==t?e:n?`${t}="%%_=safe(function(){ return ${n=n.replace(/^{|}$/g,"")} })_%%"`:e))}(n.outerHTML,s,r);a.innerHTML=i;const o=JSON.stringify(a.value);return new Function("$element","safe","$scopes",`\n\t\tvar $data = this;\n\t\twith( $data ){\n\t\t\tvar output=${o.replace(/%%_=(.+?)_%%/g,'"+safe(function(){return $1;})+"').replace(/%%_(.+?)_%%/g,'";$1\noutput+="')};return output;\n\t\t}\n\t`)}const d=(e,t,n,r)=>Array.from(e.querySelectorAll("*")).filter((e=>e.tagName.toLowerCase()in t)).reverse().map((e=>(Array.from(e.querySelectorAll("template")).map((e=>d(e.content,t,n,r))),u(e,n,r),e))),u=(e,t,n)=>{if(!e.getAttribute("tplid")){const r="xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)}));e.setAttribute("tplid",r),t[r]=l(e,n)}};var c;var f="http://www.w3.org/1999/xhtml",m="undefined"==typeof document?void 0:document,p=!!m&&"content"in m.createElement("template"),h=!!m&&m.createRange&&"createContextualFragment"in m.createRange();function v(e){return e=e.trim(),p?function(e){var t=m.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(e):h?function(e){return c||(c=m.createRange()).selectNode(m.body),c.createContextualFragment(e).childNodes[0]}(e):function(e){var t=m.createElement("body");return t.innerHTML=e,t.childNodes[0]}(e)}function b(e,t){var n,r,i=e.nodeName,o=t.nodeName;return i===o||(n=i.charCodeAt(0),r=o.charCodeAt(0),n<=90&&r>=97?i===o.toUpperCase():r<=90&&n>=97&&o===i.toUpperCase())}function g(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var _={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}g(e,t,"selected")},INPUT:function(e,t){g(e,t,"checked"),g(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var i=r.nodeValue;if(i==n||!n&&i==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,i=-1,o=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){i=o;break}o++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=i}}};function A(){}function N(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}var y,E=(y=function(e,t){var n,r,i,o,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var s=a.length-1;s>=0;s--)r=(n=a[s]).name,i=n.namespaceURI,o=n.value,i?(r=n.localName||r,e.getAttributeNS(i,r)!==o&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(i,r,o))):e.getAttribute(r)!==o&&e.setAttribute(r,o);for(var l=e.attributes,d=l.length-1;d>=0;d--)r=(n=l[d]).name,(i=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(i,r)||e.removeAttributeNS(i,r)):t.hasAttribute(r)||e.removeAttribute(r)}},function(e,t,n){if(n||(n={}),"string"==typeof t)if("#document"===e.nodeName||"HTML"===e.nodeName||"BODY"===e.nodeName){var r=t;(t=m.createElement("html")).innerHTML=r}else t=v(t);else 11===t.nodeType&&(t=t.firstElementChild);var i=n.getNodeKey||N,o=n.onBeforeNodeAdded||A,a=n.onNodeAdded||A,s=n.onBeforeElUpdated||A,l=n.onElUpdated||A,d=n.onBeforeNodeDiscarded||A,u=n.onNodeDiscarded||A,c=n.onBeforeElChildrenUpdated||A,p=n.skipFromChildren||A,h=n.addChild||function(e,t){return e.appendChild(t)},g=!0===n.childrenOnly,E=Object.create(null),x=[];function C(e){x.push(e)}function T(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=i(n))?C(r):(u(n),n.firstChild&&T(n,t)),n=n.nextSibling}}function $(e,t,n){!1!==d(e)&&(t&&t.removeChild(e),u(e),T(e,n))}function S(e){a(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=i(t);if(r){var o=E[r];o&&b(t,o)?(t.parentNode.replaceChild(o,t),w(o,t)):S(t)}else S(t);t=n}}function w(e,t,n){var r=i(t);if(r&&delete E[r],!n){if(!1===s(e,t))return;if(y(e,t),l(e),!1===c(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,a,s,l,d=p(e),u=t.firstChild,c=e.firstChild;e:for(;u;){for(s=u.nextSibling,n=i(u);!d&&c;){if(a=c.nextSibling,u.isSameNode&&u.isSameNode(c)){u=s,c=a;continue e}r=i(c);var f=c.nodeType,v=void 0;if(f===u.nodeType&&(1===f?(n?n!==r&&((l=E[n])?a===l?v=!1:(e.insertBefore(l,c),r?C(r):$(c,e,!0),c=l):v=!1):r&&(v=!1),(v=!1!==v&&b(c,u))&&w(c,u)):3!==f&&8!=f||(v=!0,c.nodeValue!==u.nodeValue&&(c.nodeValue=u.nodeValue))),v){u=s,c=a;continue e}r?C(r):$(c,e,!0),c=a}if(n&&(l=E[n])&&b(l,u))d||h(e,l),w(l,u);else{var g=o(u);!1!==g&&(g&&(u=g),u.actualize&&(u=u.actualize(e.ownerDocument||m)),h(e,u),S(u))}u=s,c=a}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=i(t))?C(n):$(t,e,!0),t=r}}(e,c,r);var A=_[e.nodeName];A&&A(e,t)}(e,t):_.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=i(n);r&&(E[r]=n),e(n),n=n.nextSibling}}(e);var O,U,k=e,L=k.nodeType,R=t.nodeType;if(!g)if(1===L)1===R?b(e,t)||(u(e),k=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(e,(O=t.nodeName,(U=t.namespaceURI)&&U!==f?m.createElementNS(U,O):m.createElement(O)))):k=t;else if(3===L||8===L){if(R===L)return k.nodeValue!==t.nodeValue&&(k.nodeValue=t.nodeValue),k;k=t}if(k===t)u(e);else{if(t.isSameNode&&t.isSameNode(k))return;if(w(k,t,g),x)for(var M=0,B=x.length;M<B;M++){var P=E[x[M]];P&&$(P,P.parentNode,!1)}}return!g&&k!==e&&e.parentNode&&(k.actualize&&(k=k.actualize(e.ownerDocument||m)),e.parentNode.replaceChild(k,e)),k});const x="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},C=(e,t)=>function(n){const r=this,i=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(i.args))}))},T=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},$=(e,t,n)=>function(r){const i=this,o=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(i,[r].concat(o.args))),a!==e);)a=a.parentNode},S=(e,t,n,r)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=C(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:$(e,n,r),callback:r})},w=(e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||T(e,t)}else T(e,t)},O=(e,t,n)=>{e.dispatchEvent(x(t,{bubbles:!0,detail:n}))},U={},k={},L=(e,t)=>{k[e]=Object.assign({},k[e],t),U[e]&&U[e].forEach((e=>e(t)))},R=(e,t)=>(U[e]=U[e]||[],U[e].push(t),e in k&&t(k[e]),()=>{U[e]=U[e].filter((e=>e!=t))});const M=e=>({main:e=>e,unmount:e=>e,onupdate:e=>e,view:e.view?e.view:e=>e}),B=e=>({onNodeAdded:V,onElUpdated:V,onBeforeElChildrenUpdated:P,onBeforeElUpdated:P}),P=e=>{if("html-static"in e.attributes)return!1},V=e=>(1!==e.nodeType||!e.getAttribute("tplid"))&&e;function j(e,t,a,s,l){return class extends HTMLElement{constructor(){super();const{base:i,options:u}=function(e,{module:t,dependencies:i,templates:a,components:s,$scopes:l}){const u=M(t);d(e,s,a,l);const c=e.getAttribute("html-model"),f=c?new Function(`return ${c}`)():{},m=e.getAttribute("tplid"),p=m?a[m]:null,h={data:t.model?r(t.model):{}},v=l[m]&&l[m].length?l[m].shift():{};h.data=Object.assign(v,h.data,f);const b={template:p,elm:e,dependencies:i,publish:L,subscribe:R,main(e){u.main=e},unmount(e){u.unmount=e},onupdate(e){u.onupdate=e},on(t,n,r){S(e,t,n,r)},off(t,n){w(e,t,n)},trigger(t,n,r){n.constructor===String?Array.from(e.querySelectorAll(n)).forEach((e=>O(e,t,{args:r}))):O(e,t,{args:n})},emit:(...t)=>{O(e,t.shift(),{args:t})},state:{set(e){if(e.constructor===Function){const t=r(h.data);e(t),b.render(t)}else b.render(e);return new Promise((e=>n((t=>n((()=>e(h.data)))))))},get:()=>r(h.data),getRaw:()=>h.data},render(t=h.data){if(!document.body.contains(e))return;h.data=Object.assign(h.data,t);const i=r(h.data),a=b.template.call(u.view(i),e,o,l);E(e,a,B()),n((t=>{Array.from(e.querySelectorAll("[tplid]")).forEach((e=>{const t=Object.assign(e.base.state.getRaw(),i);e.options.onupdate(t),e.base.render(t)}))}))}};return{base:b,options:u}}(this,{module:e,dependencies:t,templates:a,components:s,$scopes:l});this.base=i,this.options=u,this.returns=e.default(i)}connectedCallback(){var e;this.base.render(),this.returns&&this.returns.constructor===Promise?this.returns.then((e=>{var t;this.base&&(null==(t=this.options.main())||t.forEach((e=>e(this.base))))})):null==(e=this.options.main())||e.forEach((e=>e(this.base)))}disconnectedCallback(){this.options.unmount(this.base),n((()=>{document.body.contains(this)||(this.__events&&(this.__events=null),this.base&&(this.base.elm=null),this.base&&(this.base=null),i(this))}))}attributeChangedCallback(){}}}const q={},F={},H={},I={templateConfig:e=>{Object.assign(s,e)},register(e,t,n){F[e]={name:e,module:t,dependencies:n}},start(e=document.body){d(e,F,q,H),D()}},D=()=>{Object.values(F).forEach((e=>{const{name:t,module:n,dependencies:r}=e,i=j(n,r,q,F,H);customElements.define(t,i)}))};return I}));
//# sourceMappingURL=index.js.map
