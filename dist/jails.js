!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).jails={})}(this,(function(e){"use strict";const t=new DOMParser;const n=(e,t,n)=>{var r,o;null==(r=t.parentNode)||r.insertBefore(e,t),null==(o=t.parentNode)||o.insertBefore(n,t.nextSibling)},r=document.createElement("textarea"),o=e=>(r.innerHTML=e,r.value),l=e=>requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60),a=e=>JSON.parse(JSON.stringify(e)),i=e=>{var t,n,r,o=e.attributes;if(o)for(t=o.length-1;t>=0;t-=1)"function"==typeof e[r=o[t].name]&&(e[r]=null);if(o=e.childNodes)for(n=o.length,t=0;t<n;t+=1)i(e.childNodes[t])},s=(e,t)=>{try{return e()}catch(n){return t||""}},c={tags:["${","}"]};function u(e){const r=function(e,r){const o=new RegExp(`\\${r.tags[0]}(.+?)\\${r.tags[1]}`,"g"),l=t.parseFromString(e.replace(/<\/?template[^>]*>/g,""),"text/html");return l.querySelectorAll("[html-for], [html-if], [html-inner], [html-class], [html-model]").forEach((e=>{const t=e.getAttribute("html-foreach"),r=e.getAttribute("html-for"),o=e.getAttribute("html-if"),l=e.getAttribute("html-inner"),a=e.getAttribute("html-class"),i=r||t;if(i){const t=r?"html-for":"html-foreach",o=i.match(/(.*)\sin\s(.*)/)||"",l=o[1],a=o[2];e.removeAttribute(t),e.setAttribute("scope","");const s=document.createElement("script");s.dataset.scope="",s.type="text/html",s.text="%%_= $scope _%%",e.appendChild(s);const c=document.createTextNode(`%%_(function(){ var $index = 0; for(var $key in safe(function(){ return ${a} }) ){ var ${l} = ${a}[$key]; var $scope = JSON.stringify({ '${l}':${l}, $index: $index, $key:$key }); _%%`),u=document.createTextNode("%%_ $index++; } })() _%%");n(c,e,u)}if(o){e.removeAttribute("html-if");const t=document.createTextNode(`%%_ if ( safe(function(){ return ${o} }) ){ _%%`),r=document.createTextNode("%%_ } _%%");n(t,e,r)}l&&(e.removeAttribute("html-inner"),e.innerHTML=`%%_=${l}_%%`),a&&(e.removeAttribute("html-class"),e.className=(e.className+` %%_=${a}_%%`).trim())})),l.body.innerHTML.replace(o,"%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scope"==t?e:n?`${t}="%%_=safe(function(){ return ${n=n.replace(/^{|}$/g,"")} })_%%"`:e))}(e.outerHTML,c),l=JSON.stringify(r);return new Function("$element","safe",`\n\t\tvar $data = this;\n\t\twith( $data ){\n\t\t\tvar output=${l.replace(/%%_=(.+?)_%%/g,(function(e,t){return'"+safe(function(){return '+o(t)+';})+"'})).replace(/%%_(.+?)_%%/g,(function(e,t){return'";'+o(t)+'\noutput+="'}))};return output;\n\t\t}\n\t`)}const d=(e,t,n,r)=>{[].concat(e.matches&&e.matches(t)?e:[]).concat(Array.from(e.querySelectorAll(t))).reverse().forEach((e=>{e.querySelectorAll("template").forEach((e=>d(e.content,t,n,r))),f(e,n,r)}))},f=(e,t,n)=>{if(!e.getAttribute("tplid")){const r="xxxxxxxx".replace(/[xy]/g,(e=>{const t=8*Math.random()|0;return("x"==e?t:3&t|8).toString(8)}));e.setAttribute("tplid",r);const o=e.localName;if(o in n&&n[o].module.template){const l=n[o].module.template();l.constructor===Promise?(e.__template=l,l.then((n=>{e.innerHTML=n,t[r]=u(e)}))):e.innerHTML=l}t[r]=u(e)}},m={},h={},p=(e,t)=>{h[e]=Object.assign({},h[e],t),m[e]&&m[e].forEach((e=>e(t)))},b=(e,t)=>(m[e]=m[e]||[],m[e].push(t),e in h&&t(h[e]),()=>{m[e]=m[e].filter((e=>e!=t))});var g=function(){let e=new Set,t={morphStyle:"outerHTML",callbacks:{beforeNodeAdded:c,afterNodeAdded:c,beforeNodeMorphed:c,afterNodeMorphed:c,beforeNodeRemoved:c,afterNodeRemoved:c,beforeAttributeUpdated:c},head:{style:"merge",shouldPreserve:function(e){return"true"===e.getAttribute("im-preserve")},shouldReAppend:function(e){return"true"===e.getAttribute("im-re-append")},shouldRemove:c,afterHeadMorphed:c}};function n(e,t,r){if(r.head.block){let o=e.querySelector("head"),l=t.querySelector("head");if(o&&l){let a=s(l,o,r);return void Promise.all(a).then((function(){n(e,t,Object.assign(r,{head:{block:!1,ignore:!0}}))}))}}if("innerHTML"===r.morphStyle)return l(t,e,r),e.children;if("outerHTML"===r.morphStyle||null==r.morphStyle){let n=function(e,t,n){let r;r=e.firstChild;let o=r,l=0;for(;r;){let e=p(r,t,n);e>l&&(o=r,l=e),r=r.nextSibling}return o}(t,e,r),l=null==n?void 0:n.previousSibling,a=null==n?void 0:n.nextSibling,i=o(e,n,r);return n?function(e,t,n){let r=[],o=[];for(;null!=e;)r.push(e),e=e.previousSibling;for(;r.length>0;){let e=r.pop();o.push(e),t.parentElement.insertBefore(e,t)}o.push(t);for(;null!=n;)r.push(n),o.push(n),n=n.nextSibling;for(;r.length>0;)t.parentElement.insertBefore(r.pop(),t.nextSibling);return o}(l,i,a):[]}throw"Do not understand how to morph style "+r.morphStyle}function r(e,t){return t.ignoreActiveValue&&e===document.activeElement}function o(e,t,n){if(!n.ignoreActive||e!==document.activeElement)return null==t?!1===n.callbacks.beforeNodeRemoved(e)?e:(e.remove(),n.callbacks.afterNodeRemoved(e),null):d(e,t)?(!1===n.callbacks.beforeNodeMorphed(e,t)||(e instanceof HTMLHeadElement&&n.head.ignore||(e instanceof HTMLHeadElement&&"morph"!==n.head.style?s(t,e,n):(!function(e,t,n){let o=e.nodeType;if(1===o){const r=e.attributes,o=t.attributes;for(const e of r)a(e.name,t,"update",n)||t.getAttribute(e.name)!==e.value&&t.setAttribute(e.name,e.value);for(let l=o.length-1;0<=l;l--){const r=o[l];a(r.name,t,"remove",n)||(e.hasAttribute(r.name)||t.removeAttribute(r.name))}}8!==o&&3!==o||t.nodeValue!==e.nodeValue&&(t.nodeValue=e.nodeValue);r(t,n)||function(e,t,n){if(e instanceof HTMLInputElement&&t instanceof HTMLInputElement&&"file"!==e.type){let r=e.value,o=t.value;i(e,t,"checked",n),i(e,t,"disabled",n),e.hasAttribute("value")?r!==o&&(a("value",t,"update",n)||(t.setAttribute("value",r),t.value=r)):a("value",t,"remove",n)||(t.value="",t.removeAttribute("value"))}else if(e instanceof HTMLOptionElement)i(e,t,"selected",n);else if(e instanceof HTMLTextAreaElement&&t instanceof HTMLTextAreaElement){let r=e.value,o=t.value;if(a("value",t,"update",n))return;r!==o&&(t.value=r),t.firstChild&&t.firstChild.nodeValue!==r&&(t.firstChild.nodeValue=r)}}(e,t,n)}(t,e,n),r(e,n)||l(t,e,n))),n.callbacks.afterNodeMorphed(e,t)),e):!1===n.callbacks.beforeNodeRemoved(e)||!1===n.callbacks.beforeNodeAdded(t)?e:(e.parentElement.replaceChild(t,e),n.callbacks.afterNodeAdded(t),n.callbacks.afterNodeRemoved(e),t)}function l(e,t,n){let r,l=e.firstChild,a=t.firstChild;for(;l;){if(r=l,l=r.nextSibling,null==a){if(!1===n.callbacks.beforeNodeAdded(r))return;t.appendChild(r),n.callbacks.afterNodeAdded(r),_(n,r);continue}if(u(r,a,n)){o(a,r,n),a=a.nextSibling,_(n,r);continue}let i=m(e,t,r,a,n);if(i){a=f(a,i,n),o(i,r,n),_(n,r);continue}let s=h(e,t,r,a,n);if(s)a=f(a,s,n),o(s,r,n),_(n,r);else{if(!1===n.callbacks.beforeNodeAdded(r))return;t.insertBefore(r,a),n.callbacks.afterNodeAdded(r),_(n,r)}}for(;null!==a;){let e=a;a=a.nextSibling,b(e,n)}}function a(e,t,n,r){return!("value"!==e||!r.ignoreActiveValue||t!==document.activeElement)||!1===r.callbacks.beforeAttributeUpdated(e,t,n)}function i(e,t,n,r){if(e[n]!==t[n]){let o=a(n,t,"update",r);o||(t[n]=e[n]),e[n]?o||t.setAttribute(n,e[n]):a(n,t,"remove",r)||t.removeAttribute(n)}}function s(e,t,n){let r=[],o=[],l=[],a=[],i=n.head.style,s=new Map;for(const u of e.children)s.set(u.outerHTML,u);for(const u of t.children){let e=s.has(u.outerHTML),t=n.head.shouldReAppend(u),r=n.head.shouldPreserve(u);e||r?t?o.push(u):(s.delete(u.outerHTML),l.push(u)):"append"===i?t&&(o.push(u),a.push(u)):!1!==n.head.shouldRemove(u)&&o.push(u)}a.push(...s.values());let c=[];for(const u of a){let e=document.createRange().createContextualFragment(u.outerHTML).firstChild;if(!1!==n.callbacks.beforeNodeAdded(e)){if(e.href||e.src){let t=null,n=new Promise((function(e){t=e}));e.addEventListener("load",(function(){t()})),c.push(n)}t.appendChild(e),n.callbacks.afterNodeAdded(e),r.push(e)}}for(const u of o)!1!==n.callbacks.beforeNodeRemoved(u)&&(t.removeChild(u),n.callbacks.afterNodeRemoved(u));return n.head.afterHeadMorphed(t,{added:r,kept:l,removed:o}),c}function c(){}function u(e,t,n){return null!=e&&null!=t&&(e.nodeType===t.nodeType&&e.tagName===t.tagName&&(""!==e.id&&e.id===t.id||y(n,e,t)>0))}function d(e,t){return null!=e&&null!=t&&(e.nodeType===t.nodeType&&e.tagName===t.tagName)}function f(e,t,n){for(;e!==t;){let t=e;e=e.nextSibling,b(t,n)}return _(n,t),t.nextSibling}function m(e,t,n,r,o){let l=y(o,n,t);if(l>0){let t=r,a=0;for(;null!=t;){if(u(n,t,o))return t;if(a+=y(o,t,e),a>l)return null;t=t.nextSibling}}return null}function h(e,t,n,r,o){let l=r,a=n.nextSibling,i=0;for(;null!=l;){if(y(o,l,e)>0)return null;if(d(n,l))return l;if(d(a,l)&&(i++,a=a.nextSibling,i>=2))return null;l=l.nextSibling}return l}function p(e,t,n){return d(e,t)?.5+y(n,e,t):0}function b(e,t){_(t,e),!1!==t.callbacks.beforeNodeRemoved(e)&&(e.remove(),t.callbacks.afterNodeRemoved(e))}function g(e,t){return!e.deadIds.has(t)}function v(t,n,r){return(t.idMap.get(r)||e).has(n)}function _(t,n){let r=t.idMap.get(n)||e;for(const e of r)t.deadIds.add(e)}function y(t,n,r){let o=t.idMap.get(n)||e,l=0;for(const e of o)g(t,e)&&v(t,e,r)&&++l;return l}function A(e,t){let n=e.parentElement,r=e.querySelectorAll("[id]");for(const o of r){let e=o;for(;e!==n&&null!=e;){let n=t.get(e);null==n&&(n=new Set,t.set(e,n)),n.add(o.id),e=e.parentElement}}}function S(e,t){let n=new Map;return A(e,n),A(t,n),n}return{morph:function(e,r,o={}){e instanceof Document&&(e=e.documentElement),"string"==typeof r&&(r=function(e){let t=new DOMParser,n=e.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,"");if(n.match(/<\/html>/)||n.match(/<\/head>/)||n.match(/<\/body>/)){let r=t.parseFromString(e,"text/html");if(n.match(/<\/html>/))return r.generatedByIdiomorph=!0,r;{let e=r.firstChild;return e?(e.generatedByIdiomorph=!0,e):null}}{let n=t.parseFromString("<body><template>"+e+"</template></body>","text/html").body.querySelector("template").content;return n.generatedByIdiomorph=!0,n}}(r));let l=function(e){if(null==e){return document.createElement("div")}if(e.generatedByIdiomorph)return e;if(e instanceof Node){const t=document.createElement("div");return t.append(e),t}{const t=document.createElement("div");for(const n of[...e])t.append(n);return t}}(r),a=function(e,n,r){return r=function(e){let n={};return Object.assign(n,t),Object.assign(n,e),n.callbacks={},Object.assign(n.callbacks,t.callbacks),Object.assign(n.callbacks,e.callbacks),n.head={},Object.assign(n.head,t.head),Object.assign(n.head,e.head),n}(r),{target:e,newContent:n,config:r,morphStyle:r.morphStyle,ignoreActive:r.ignoreActive,ignoreActiveValue:r.ignoreActiveValue,idMap:S(e,n),deadIds:new Set,callbacks:r.callbacks,head:r.head}}(e,l,o);return n(e,l,a)},defaults:t}}();const v="CustomEvent"in window&&"function"==typeof window.CustomEvent?(e,t)=>new CustomEvent(e,t):(e,t)=>{const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!0,!0,t),n},_=(e,t)=>function(n){const r=this,o=n.detail||{};e.__events[t].forEach((e=>{e.handler.apply(r,[n].concat(o.args))}))},y=(e,t)=>{e.__events[t]&&e.__events[t].listener&&(e.removeEventListener(t,e.__events[t].listener,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),delete e.__events[t])},A=(e,t,n)=>function(r){const o=this,l=r.detail||{};let a=r.target;for(;a&&(a.matches(t)&&(r.delegateTarget=a,n.apply(o,[r].concat(l.args))),a!==e);)a=a.parentNode},S=(e,t,n,r)=>{if(e.__events=e.__events||{},e.__events[t]=e.__events[t]||[],!e.__events[t].length){const n=_(e,t);e.addEventListener(t,n,"focus"==t||"blur"==t||"mouseenter"==t||"mouseleave"==t),e.__events[t].listener=n}n.call?e.__events[t].push({handler:n,callback:n}):e.__events[t].push({handler:A(e,n,r),callback:r})},E=(e,t,n)=>{if(n&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=n})),e.__events[t].listener=r.listener,e.__events[t].length||y(e,t)}else y(e,t)},x=(e,t,n)=>{e.dispatchEvent(v(t,{bubbles:!0,detail:n}))};const N=e=>({main:e=>e,unmount:e=>e,onupdate:e=>e,view:e.view?e.view:e=>e}),k=e=>{e.querySelectorAll("[scope]").forEach((e=>{e.querySelectorAll("[tplid]").forEach((t=>{if(!t.___scope___){const n=e.lastElementChild;t.___scope___="scope"in n.dataset?new Function(`return ${n.text}`)():{}}}))}))},M=e=>({callbacks:{beforeNodeMorphed(t){if(1===t.nodeType){if("html-static"in t.attributes)return!1;if(t.base&&t!==e)return!1}}}});function T(e,t,n,r){return class extends HTMLElement{constructor(){super();const{base:o,options:i}=function(e,{module:t,dependencies:n,templates:r,components:o}){const i=N(t),c=new Function(`return ${e.getAttribute("html-model")||"{}"}`)(),u=Object.keys(o).toString();d(e,u,r,o);const f=e.getAttribute("tplid"),m=f?r[f]:null,h={data:t.model?a(t.model):{}};h.data=Object.assign(h.data,c);const v={template:m,elm:e,dependencies:n,publish:p,subscribe:b,main(e){i.main=e},unmount(e){i.unmount=e},onupdate(e){i.onupdate=e},on(t,n,r){S(e,t,n,r)},off(t,n){E(e,t,n)},trigger(t,n,r){n.constructor===String?Array.from(e.querySelectorAll(n)).forEach((e=>x(e,t,{args:r}))):x(e,t,{args:n})},emit:(...t)=>{x(e,t.shift(),{args:t})},state:{set(e){if(e.constructor===Function){const t=a(h.data);e(t),v.render(t)}else v.render(e);return new Promise((e=>l((t=>l((()=>e(h.data)))))))},get:()=>a(h.data),getRaw:()=>h.data},render(t=h.data){if(!document.body.contains(e))return;h.data=Object.assign(h.data,t);const n=a(h.data),o=r[f].call(Object.assign(i.view(n),e.___scope___),e,s);g.morph(e,o,M(e)),k(e),l((n=>{Array.from(e.querySelectorAll("[tplid]")).forEach((e=>{const n=Object.assign(e.base.state.getRaw(),t);e.options.onupdate(n),e.base.render(n)}))}))},innerHTML(t,n){const r=n?t:e,o=r.cloneNode(),a=n||t;o.innerHTML=a,l((e=>g.morph(r,o,M)))}};return{base:v,options:i}}(this,{module:e,dependencies:t,templates:n,components:r});this.base=o,this.options=i,this.returns=e.default(o)}connectedCallback(){if(this.base.render(),this.__template&&this.__template.constructor===Promise)this.__template.then((e=>{if(this.base&&this.options.main){const e=this.options.main(this.base);e&&e.length&&e.forEach((e=>e(this.base)))}}));else if(this.returns&&this.returns.constructor===Promise)this.returns.then((e=>{if(this.base&&this.options.main){const e=this.options.main(this.base);e&&e.length&&e.forEach((e=>e(this.base)))}}));else if(this.base&&this.options.main){const e=this.options.main(this.base);e&&e.length&&e.forEach((e=>e(this.base)))}}disconnectedCallback(){this.options.unmount(this.base),l((()=>{document.body.contains(this)||(this.__events&&(this.__events=null),this.base&&(this.base.elm=null),this.base&&(this.base=null),i(this))}))}attributeChangedCallback(){}}}const $={},w={},H={templateConfig:e=>{Object.assign(c,e)},publish:p,subscribe:b,register(e,t,n={}){w[e]={name:e,module:t,dependencies:n}},start(e=document.body){const t=Object.keys(w),n=t.toString();t.length&&(d(e,n,$,w),C())}},C=()=>{Object.values(w).forEach((e=>{const{name:t,module:n,dependencies:r}=e;if(!customElements.get(t)){const e=T(n,r,$,w);customElements.define(t,e)}}))};e.default=H,e.html=(e,...t)=>{let n=e.raw,r="";return t.forEach(((e,t)=>{let o=n[t];Array.isArray(e)&&(e=e.join("")),r+=o,r+=e})),r+=n[n.length-1],r},Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
//# sourceMappingURL=jails.js.map
