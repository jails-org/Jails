!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("jails",[],t):"object"==typeof exports?exports.jails=t():e.jails=t()}(self,(()=>(()=>{"use strict";var e={492:(e,t,n)=>{var r;n.r(t),n.d(t,{default:()=>f});var o="undefined"==typeof document?void 0:document,i=!!o&&"content"in o.createElement("template"),a=!!o&&o.createRange&&"createContextualFragment"in o.createRange();function l(e,t){var n,r,o=e.nodeName,i=t.nodeName;return o===i||(n=o.charCodeAt(0),r=i.charCodeAt(0),n<=90&&r>=97?o===i.toUpperCase():r<=90&&n>=97&&i===o.toUpperCase())}function s(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var u={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}s(e,t,"selected")},INPUT:function(e,t){s(e,t,"checked"),s(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var o=r.nodeValue;if(o==n||!n&&o==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,o=-1,i=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){o=i;break}i++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=o}}};function d(){}function c(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}const f=function(e,t,n){if(n||(n={}),"string"==typeof t)if("#document"===e.nodeName||"HTML"===e.nodeName||"BODY"===e.nodeName){var s=t;(t=o.createElement("html")).innerHTML=s}else f=(f=t).trim(),t=i?function(e){var t=o.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(f):a?function(e){return r||(r=o.createRange()).selectNode(o.body),r.createContextualFragment(e).childNodes[0]}(f):function(e){var t=o.createElement("body");return t.innerHTML=e,t.childNodes[0]}(f);else 11===t.nodeType&&(t=t.firstElementChild);var f,p=n.getNodeKey||c,m=n.onBeforeNodeAdded||d,v=n.onNodeAdded||d,h=n.onBeforeElUpdated||d,b=n.onElUpdated||d,g=n.onBeforeNodeDiscarded||d,_=n.onNodeDiscarded||d,y=n.onBeforeElChildrenUpdated||d,A=n.skipFromChildren||d,N=n.addChild||function(e,t){return e.appendChild(t)},x=!0===n.childrenOnly,C=Object.create(null),E=[];function S(e){E.push(e)}function T(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=p(n))?S(r):(_(n),n.firstChild&&T(n,t)),n=n.nextSibling}}function $(e,t,n){!1!==g(e)&&(t&&t.removeChild(e),_(e),T(e,n))}function O(e){v(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=p(t);if(r){var o=C[r];o&&l(t,o)?(t.parentNode.replaceChild(o,t),w(o,t)):O(t)}else O(t);t=n}}function w(e,t,n){var r=p(t);if(r&&delete C[r],!n){if(!1===h(e,t))return;if(function(e,t){var n,r,o,i,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var l=a.length-1;l>=0;l--)r=(n=a[l]).name,o=n.namespaceURI,i=n.value,o?(r=n.localName||r,e.getAttributeNS(o,r)!==i&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(o,r,i))):e.getAttribute(r)!==i&&e.setAttribute(r,i);for(var s=e.attributes,u=s.length-1;u>=0;u--)r=(n=s[u]).name,(o=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(o,r)||e.removeAttributeNS(o,r)):t.hasAttribute(r)||e.removeAttribute(r)}}(e,t),b(e),!1===y(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,r,i,a,s,d=A(e),c=t.firstChild,f=e.firstChild;e:for(;c;){for(a=c.nextSibling,n=p(c);!d&&f;){if(i=f.nextSibling,c.isSameNode&&c.isSameNode(f)){c=a,f=i;continue e}r=p(f);var v=f.nodeType,h=void 0;if(v===c.nodeType&&(1===v?(n?n!==r&&((s=C[n])?i===s?h=!1:(e.insertBefore(s,f),r?S(r):$(f,e,!0),f=s):h=!1):r&&(h=!1),(h=!1!==h&&l(f,c))&&w(f,c)):3!==v&&8!=v||(h=!0,f.nodeValue!==c.nodeValue&&(f.nodeValue=c.nodeValue))),h){c=a,f=i;continue e}r?S(r):$(f,e,!0),f=i}if(n&&(s=C[n])&&l(s,c))d||N(e,s),w(s,c);else{var b=m(c);!1!==b&&(b&&(c=b),c.actualize&&(c=c.actualize(e.ownerDocument||o)),N(e,c),O(c))}c=a,f=i}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=p(t))?S(n):$(t,e,!0),t=r}}(e,f,r);var g=u[e.nodeName];g&&g(e,t)}(e,t):u.TEXTAREA(e,t)}!function e(t){if(1===t.nodeType||11===t.nodeType)for(var n=t.firstChild;n;){var r=p(n);r&&(C[r]=n),e(n),n=n.nextSibling}}(e);var j,M,P=e,U=P.nodeType,k=t.nodeType;if(!x)if(1===U)1===k?l(e,t)||(_(e),P=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(e,(j=t.nodeName,(M=t.namespaceURI)&&"http://www.w3.org/1999/xhtml"!==M?o.createElementNS(M,j):o.createElement(j)))):P=t;else if(3===U||8===U){if(k===U)return P.nodeValue!==t.nodeValue&&(P.nodeValue=t.nodeValue),P;P=t}if(P===t)_(e);else{if(t.isSameNode&&t.isSameNode(P))return;if(w(P,t,x),E)for(var F=0,L=E.length;F<L;F++){var R=C[E[F]];R&&$(R,R.parentNode,!1)}}return!x&&P!==e&&e.parentNode&&(P.actualize&&(P=P.actualize(e.ownerDocument||o)),e.parentNode.replaceChild(P,e)),P}},106:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});const n=new DOMParser;t.default=function(e,t,o){const i=new RegExp(`\\${t.tags[0]}(.+?)\\${t.tags[1]}`,"g"),a=n.parseFromString(e.replace(/<\/?template[^>]*>/g,""),"text/html");return a.querySelectorAll("[html-for], [html-if], [html-inner], [html-class]").forEach((e=>{const t=e.getAttribute("html-foreach"),n=e.getAttribute("html-for"),i=e.getAttribute("html-if"),a=e.getAttribute("html-inner"),l=e.getAttribute("html-class"),s=n||t;if(s){const t=n?"html-for":"html-foreach",i=s.match(/(.*)\sin\s(.*)/)||"",a=i[1],l=i[2];e.removeAttribute(t);const u=Array.from(e.querySelectorAll(`[tplid]:not([${t}] [tplid])`)).map((e=>{const t=e.getAttribute("tplid");return o[t]=[],t})),d=document.createTextNode(`<%(function(){ var idx = 0; for(var $key in safe(function(){ return ${l} }) ){ var ${a} = ${l}[$key]; ${JSON.stringify(u)}.map(function(id){ if($scopes[id]) { $scopes[id][idx] = { ${a}: ${l}[$key], $index: idx, $key: $key } } }); %>`),c=document.createTextNode("<% idx++}})() %>");r(d,e,c)}if(i){e.removeAttribute("html-if");const t=document.createTextNode(`<% if ( safe(function(){ return ${i} }) ){ %>`),n=document.createTextNode("<% } %>");r(t,e,n)}a&&(e.removeAttribute("html-inner"),e.innerHTML=`<%=${a}%>`),l&&(e.removeAttribute("html-class"),e.className+=` <%=${l}%>`)})),a.body.innerHTML.replace(i,"<%=$1%>").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"<%if(safe(function(){ return $2 })){%>$1<%}%>").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scope"==t?e:n?`<%if ( safe(function(){ return ${n=n.replace(/^{|}$/g,"")} }) ) {%> ${t}="<%=${n}%>" <%}%>`:e))};const r=(e,t,n)=>{var r,o;null===(r=t.parentNode)||void 0===r||r.insertBefore(e,t),null===(o=t.parentNode)||void 0===o||o.insertBefore(n,t.nextSibling)}},565:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(492)),i=n(502),a=n(585),l=n(139),s=n(119);t.default=function(e,{module:t,dependencies:n,templates:r,components:c,$scopes:f}){const p=u(t);(0,a.buildtemplates)(e,c,r,f);const m=e.getAttribute("tplid"),v=m?r[m]:null,h={data:t.model?(0,i.dup)(t.model):{}},b=f[m]&&f[m].length?f[m].shift():{};h.data=Object.assign(b,h.data,e.initialState?JSON.parse(e.initialState):null);const g={template:v,elm:e,dependencies:n,publish:s.publish,subscribe:s.subscribe,main(e){p.main=e},unmount(e){p.unmount=e},onupdate(e){p.onupdate=e},on(t,n,r){(0,l.on)(e,t,n,r)},off(t,n){(0,l.off)(e,t,n)},trigger(t,n,r){n.constructor===String?Array.from(e.querySelectorAll(n)).forEach((e=>(0,l.trigger)(e,t,{args:r}))):(0,l.trigger)(e,t,{args:n})},emit:(...t)=>{(0,l.trigger)(e,t.shift(),{args:t})},state:{set(e){if(e.constructor===Function){const t=(0,i.dup)(h.data);e(t),g.render(t)}else g.render(e);return new Promise((e=>(0,i.rAF)((t=>(0,i.rAF)((()=>e(h.data)))))))},get:()=>(0,i.dup)(h.data),getRaw:()=>h.data},render(t=h.data){if(!document.body.contains(e))return;h.data=Object.assign(h.data,t);const n=(0,i.dup)(h.data),r=g.template.call(p.view(n),e,f);(0,o.default)(e,r,d(e,p)),(0,i.rAF)((t=>{Array.from(e.querySelectorAll("[tplid]")).forEach((e=>{const t=Object.assign(e.base.state.getRaw(),n);e.options.onupdate(t),e.base.render(t)}))}))}};return{base:g,options:p}};const u=e=>({main:e=>e,unmount:e=>e,onupdate:e=>e,view:e.view?e.view:e=>e}),d=e=>({onNodeAdded:f,onElUpdated:f,onBeforeElChildrenUpdated:c,onBeforeElUpdated:c}),c=e=>{if("html-static"in e.attributes)return!1},f=e=>(1!==e.nodeType||!e.getAttribute("tplid"))&&e},747:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(565)),i=n(502);t.default=function(e,t,n,r,a){return class extends HTMLElement{constructor(){super();const{base:i,options:l}=(0,o.default)(this,{module:e,dependencies:t,templates:n,components:r,$scopes:a});this.base=i,this.options=l,this.returns=e.default(i)}connectedCallback(){var e;this.base.render(),this.returns&&this.returns.constructor===Promise?this.returns.then((e=>{var t;this.base&&(null===(t=this.options.main())||void 0===t||t.forEach((e=>e(this.base))))})):null===(e=this.options.main())||void 0===e||e.forEach((e=>e(this.base)))}disconnectedCallback(){this.options.unmount(this.base),(0,i.rAF)((()=>{document.body.contains(this)||(this.__events&&(this.__events=null),this.base&&(this.base.elm=null),this.base&&(this.base=null),(0,i.purge)(this))}))}attributeChangedCallback(){}}}},341:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=n(585),i=r(n(747)),a={},l={},s={};t.default={templateConfig:o.templateConfig,register(e,t,n){l[e]={name:e,module:t,dependencies:n}},start(){const e=document.body;(0,o.buildtemplates)(e,l,a,s),u()}};const u=()=>{Object.values(l).forEach((e=>{const{name:t,module:n,dependencies:r}=e,o=(0,i.default)(n,r,a,l,s);customElements.define(t,o)}))}},585:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.buildtemplates=t.templateConfig=void 0;const o=r(n(106)),i=n(502),a=document.createElement("textarea"),l={tags:["${","}"]};function s(e,t){return e.initialState=d(e),a.innerHTML=(0,o.default)(e.outerHTML.replace(/(?!".*)\'(?!.*")/g,"\\'"),l,t),new Function("$element","$scopes",`\n\t\tvar $data = this;\n\n\t\tfunction safe(execute, val){\n\t\t\ttry{return execute()}catch(err){return val || ''}\n\t\t}\n\n\t\twith( $data ){\n\t\t\tvar output = '${a.value.replace(/\n/g,"").replace(/<%=(.+?)%>/g,"'+safe(function(){return $1;})+'").replace(/<%(.+?)%>/g,"';$1\noutput+='")}'\n\t\t\treturn output\n\t\t}\n\t`)}t.templateConfig=e=>{Object.assign(l,e)},t.default=s,t.buildtemplates=(e,n,r,o)=>Array.from(e.querySelectorAll("*")).filter((e=>e.tagName.toLowerCase()in n)).reverse().map((e=>(Array.from(e.querySelectorAll("template")).map((e=>(0,t.buildtemplates)(e.content,n,r,o))),u(e,r,o),e)));const u=(e,t,n)=>{if(!e.getAttribute("tplid")){const r=(0,i.uuid)();e.setAttribute("tplid",r),t[r]=s(e,n)}},d=e=>{const t=e.getAttribute("html-model");return t?(e.removeAttribute("html-model"),JSON.stringify(new Function(`return ${t}`)())):null}},139:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.trigger=t.off=t.on=void 0;const n="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},r=(e,t)=>function(n){const r=this,o=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(o.args))}))},o=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},i=(e,t,n)=>function(r){const o=this,i=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(o,[r].concat(i.args))),a!==e);)a=a.parentNode};t.on=(e,t,n,o)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=r(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:i(e,n,o),callback:o})},t.off=(e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||o(e,t)}else o(e,t)},t.trigger=(e,t,r)=>{e.dispatchEvent(n(t,{bubbles:!0,detail:r}))}},502:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.purge=t.dup=t.uuid=t.rAF=void 0,t.rAF=e=>requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60),t.uuid=()=>"xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)})),t.dup=e=>JSON.parse(JSON.stringify(e)),t.purge=e=>{var n,r,o,i=e.attributes;if(i)for(n=i.length-1;n>=0;n-=1)"function"==typeof e[o=i[n].name]&&(e[o]=null);if(i=e.childNodes)for(r=i.length,n=0;n<r;n+=1)(0,t.purge)(e.childNodes[n])}},119:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.subscribe=t.publish=void 0;const n={},r={};t.publish=(e,t)=>{r[e]=Object.assign({},r[e],t),n[e]&&n[e].forEach((e=>e(t)))},t.subscribe=(e,t)=>(n[e]=n[e]||[],n[e].push(t),e in r&&t(r[e]),()=>{n[e]=n[e].filter((e=>e!=t))})}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}return n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(341)})()));
//# sourceMappingURL=index.js.map