!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).jails={})}(this,(function(e){"use strict";const t=document.createElement("textarea"),n={scope:{}},r=e=>(t.innerHTML=e,t.value),o=()=>Math.random().toString(36).substring(2,9),l=(e,t)=>{try{return e()}catch(n){return t||""}};var i=function(){let e=new Set,t={morphStyle:"outerHTML",callbacks:{beforeNodeAdded:c,afterNodeAdded:c,beforeNodeMorphed:c,afterNodeMorphed:c,beforeNodeRemoved:c,afterNodeRemoved:c,beforeAttributeUpdated:c,beforeNodePantried:c},head:{style:"merge",shouldPreserve:function(e){return"true"===e.getAttribute("im-preserve")},shouldReAppend:function(e){return"true"===e.getAttribute("im-re-append")},shouldRemove:c,afterHeadMorphed:c}};function n(e,t,r){var i,a;if(r.head.block){let o=e.querySelector("head"),l=t.querySelector("head");if(o&&l){let i=d(l,o,r);return void Promise.all(i).then((function(){n(e,t,Object.assign(r,{head:{block:!1,ignore:!0}}))}))}}if("innerHTML"===r.morphStyle)return l(t,e,r),r.config.twoPass&&E(e,r),Array.from(e.children);if("outerHTML"!==r.morphStyle&&null!=r.morphStyle)throw"Do not understand how to morph style "+r.morphStyle;{let n=function(e,t,n){let r;r=e.firstChild;let o=r,l=0;for(;r;){let e=g(r,t,n);e>l&&(o=r,l=e),r=r.nextSibling}return o}(t,e,r),l=null!=(i=null==n?void 0:n.previousSibling)?i:null,s=null!=(a=null==n?void 0:n.nextSibling)?a:null,d=o(e,n,r);if(!n)return[];if(d){const e=function(e,t,n){var r,o;let l=[],i=[];for(;null!=e;)l.push(e),e=e.previousSibling;let a=l.pop();for(;void 0!==a;)i.push(a),null==(r=t.parentElement)||r.insertBefore(a,t),a=l.pop();i.push(t);for(;null!=n;)l.push(n),i.push(n),n=n.nextSibling;for(;l.length>0;){const e=l.pop();null==(o=t.parentElement)||o.insertBefore(e,t.nextSibling)}return i}(l,d,s);return r.config.twoPass&&E(d.parentNode,r),e}}}function r(e,t){return!!t.ignoreActiveValue&&e===document.activeElement&&e!==document.body}function o(e,t,n){var o,i;return n.ignoreActive&&e===document.activeElement?null:null==t?!1===n.callbacks.beforeNodeRemoved(e)?e:(null==(o=e.parentNode)||o.removeChild(e),n.callbacks.afterNodeRemoved(e),null):m(e,t)?(!1===n.callbacks.beforeNodeMorphed(e,t)||(e instanceof HTMLHeadElement&&n.head.ignore||(e instanceof HTMLHeadElement&&"morph"!==n.head.style?d(t,e,n):(a(t,e,n),r(e,n)||l(t,e,n))),n.callbacks.afterNodeMorphed(e,t)),e):!1===n.callbacks.beforeNodeRemoved(e)||!1===n.callbacks.beforeNodeAdded(t)?e:(null==(i=e.parentNode)||i.replaceChild(t,e),n.callbacks.afterNodeAdded(t),n.callbacks.afterNodeRemoved(e),t)}function l(e,t,n){e instanceof HTMLTemplateElement&&t instanceof HTMLTemplateElement&&(e=e.content,t=t.content);let r,l=e.firstChild,i=t.firstChild;for(;l;){if(r=l,l=r.nextSibling,null==i){if(n.config.twoPass&&n.persistentIds.has(r.id))t.appendChild(r);else{if(!1===n.callbacks.beforeNodeAdded(r))continue;t.appendChild(r),n.callbacks.afterNodeAdded(r)}k(n,r);continue}if(f(r,i,n)){o(i,r,n),i=i.nextSibling,k(n,r);continue}let a=h(e,t,r,i,n);if(a){i=p(i,a,n),o(a,r,n),k(n,r);continue}let s=b(e,t,r,i,n);if(s)i=p(i,s,n),o(s,r,n),k(n,r);else{if(n.config.twoPass&&n.persistentIds.has(r.id))t.insertBefore(r,i);else{if(!1===n.callbacks.beforeNodeAdded(r))continue;t.insertBefore(r,i),n.callbacks.afterNodeAdded(r)}k(n,r)}}for(;null!==i;){let e=i;i=i.nextSibling,y(e,n)}}function i(e,t,n,r){return!("value"!==e||!r.ignoreActiveValue||t!==document.activeElement)||!1===r.callbacks.beforeAttributeUpdated(e,t,n)}function a(e,t,n){let o=e.nodeType;if(1===o){const r=e,o=t,l=r.attributes,a=o.attributes;for(const e of l)i(e.name,o,"update",n)||o.getAttribute(e.name)!==e.value&&o.setAttribute(e.name,e.value);for(let e=a.length-1;0<=e;e--){const t=a[e];if(t&&!r.hasAttribute(t.name)){if(i(t.name,o,"remove",n))continue;o.removeAttribute(t.name)}}}8!==o&&3!==o||t.nodeValue!==e.nodeValue&&(t.nodeValue=e.nodeValue),r(t,n)||function(e,t,n){if(e instanceof HTMLInputElement&&t instanceof HTMLInputElement&&"file"!==e.type){let r=e.value,o=t.value;s(e,t,"checked",n),s(e,t,"disabled",n),e.hasAttribute("value")?r!==o&&(i("value",t,"update",n)||(t.setAttribute("value",r),t.value=r)):i("value",t,"remove",n)||(t.value="",t.removeAttribute("value"))}else if(e instanceof HTMLOptionElement&&t instanceof HTMLOptionElement)s(e,t,"selected",n);else if(e instanceof HTMLTextAreaElement&&t instanceof HTMLTextAreaElement){let r=e.value,o=t.value;if(i("value",t,"update",n))return;r!==o&&(t.value=r),t.firstChild&&t.firstChild.nodeValue!==r&&(t.firstChild.nodeValue=r)}}(e,t,n)}function s(e,t,n,r){if(!(e instanceof Element&&t instanceof Element))return;const o=e[n];if(o!==t[n]){let l=i(n,t,"update",r);l||(t[n]=e[n]),o?l||t.setAttribute(n,o):i(n,t,"remove",r)||t.removeAttribute(n)}}function d(e,t,n){let r=[],o=[],l=[],i=[],a=n.head.style,s=new Map;for(const c of e.children)s.set(c.outerHTML,c);for(const c of t.children){let e=s.has(c.outerHTML),t=n.head.shouldReAppend(c),r=n.head.shouldPreserve(c);e||r?t?o.push(c):(s.delete(c.outerHTML),l.push(c)):"append"===a?t&&(o.push(c),i.push(c)):!1!==n.head.shouldRemove(c)&&o.push(c)}i.push(...s.values());let d=[];for(const c of i){let e=document.createRange().createContextualFragment(c.outerHTML).firstChild;if(!1!==n.callbacks.beforeNodeAdded(e)){if("href"in e&&e.href||"src"in e&&e.src){let t,n=new Promise((function(e){t=e}));e.addEventListener("load",(function(){t()})),d.push(n)}t.appendChild(e),n.callbacks.afterNodeAdded(e),r.push(e)}}for(const c of o)!1!==n.callbacks.beforeNodeRemoved(c)&&(t.removeChild(c),n.callbacks.afterNodeRemoved(c));return n.head.afterHeadMorphed(t,{added:r,kept:l,removed:o}),d}function c(){}function u(){const e=document.createElement("div");return e.hidden=!0,document.body.insertAdjacentElement("afterend",e),e}function f(e,t,n){return null!=e&&null!=t&&(e instanceof Element&&t instanceof Element&&e.tagName===t.tagName&&(""!==e.id&&e.id===t.id||M(n,e,t)>0))}function m(e,t){return null!=e&&null!=t&&((!e.id||e.id===t.id)&&(e.nodeType===t.nodeType&&e.tagName===t.tagName))}function p(e,t,n){let r=e;for(;r!==t;){let e=r;r=e.nextSibling,y(e,n)}return k(n,t),t.nextSibling}function h(e,t,n,r,o){let l=M(o,n,t),i=null;if(l>0){i=r;let t=0;for(;null!=i;){if(f(n,i,o))return i;if(t+=M(o,i,e),t>l)return null;i=i.nextSibling}}return i}function b(e,t,n,r,o){let l=r,i=n.nextSibling,a=0;for(;null!=l;){if(M(o,l,e)>0)return null;if(m(l,n))return l;if(m(l,i)&&(a++,i=i.nextSibling,a>=2))return null;l=l.nextSibling}return l}const v=new WeakSet;function g(e,t,n){return m(t,e)?.5+M(n,e,t):0}function y(t,n){var r;if(k(n,t),n.config.twoPass&&function(t,n){for(const r of t.idMap.get(n)||e)if(t.persistentIds.has(r))return!0;return!1}(n,t)&&t instanceof Element)A(t,n);else{if(!1===n.callbacks.beforeNodeRemoved(t))return;null==(r=t.parentNode)||r.removeChild(t),n.callbacks.afterNodeRemoved(t)}}function A(e,t){var n;if(!1!==t.callbacks.beforeNodePantried(e))if(Array.from(e.childNodes).forEach((e=>{A(e,t)})),t.persistentIds.has(e.id))t.pantry.moveBefore?t.pantry.moveBefore(e,null):t.pantry.insertBefore(e,null);else{if(!1===t.callbacks.beforeNodeRemoved(e))return;null==(n=e.parentNode)||n.removeChild(e),t.callbacks.afterNodeRemoved(e)}}function E(e,t){e instanceof Element&&(Array.from(t.pantry.children).reverse().forEach((n=>{var r;const o=e.querySelector(`#${n.id}`);if(o){if(null==(r=o.parentElement)?void 0:r.moveBefore)for(o.parentElement.moveBefore(n,o);o.hasChildNodes();)n.moveBefore(o.firstChild,null);else for(o.before(n);o.firstChild;)n.insertBefore(o.firstChild,null);!1!==t.callbacks.beforeNodeMorphed(n,o)&&(a(o,n,t),t.callbacks.afterNodeMorphed(n,o)),o.remove()}})),t.pantry.remove())}function N(e,t){return!e.deadIds.has(t)}function S(t,n,r){return(t.idMap.get(r)||e).has(n)}function k(t,n){let r=t.idMap.get(n)||e;for(const e of r)t.deadIds.add(e)}function M(t,n,r){let o=t.idMap.get(n)||e,l=0;for(const e of o)N(t,e)&&S(t,e,r)&&++l;return l}function T(e){let t=Array.from(e.querySelectorAll("[id]"));return e.id&&t.push(e),t}function C(e,t){let n=e.parentElement;for(const r of T(e)){let e=r;for(;e!==n&&null!=e;){let n=t.get(e);null==n&&(n=new Set,t.set(e,n)),n.add(r.id),e=e.parentElement}}}function w(e,t){let n=new Map;return C(e,n),C(t,n),n}function $(e,t){const n=e=>e.tagName+"#"+e.id,r=new Set(T(e).map(n));let o=new Set;for(const l of T(t))r.has(n(l))&&o.add(l.id);return o}return{morph:function(e,r,o={}){e instanceof Document&&(e=e.documentElement),"string"==typeof r&&(r=function(e){let t=new DOMParser,n=e.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,"");if(n.match(/<\/html>/)||n.match(/<\/head>/)||n.match(/<\/body>/)){let r=t.parseFromString(e,"text/html");if(n.match(/<\/html>/))return v.add(r),r;{let e=r.firstChild;return e?(v.add(e),e):null}}{let n=t.parseFromString("<body><template>"+e+"</template></body>","text/html").body.querySelector("template").content;return v.add(n),n}}(r));let l=function(e){if(null==e){return document.createElement("div")}if(v.has(e))return e;if(e instanceof Node){const t=document.createElement("div");return t.append(e),t}{const t=document.createElement("div");for(const n of[...e])t.append(n);return t}}(r),i=function(e,n,r){const o=function(e){let n=Object.assign({},t);return Object.assign(n,e),n.callbacks=Object.assign({},t.callbacks,e.callbacks),n.head=Object.assign({},t.head,e.head),n}(r);return{target:e,newContent:n,config:o,morphStyle:o.morphStyle,ignoreActive:o.ignoreActive,ignoreActiveValue:o.ignoreActiveValue,idMap:w(e,n),deadIds:new Set,persistentIds:o.twoPass?$(e,n):new Set,pantry:o.twoPass?u():document.createElement("div"),callbacks:o.callbacks,head:o.head}}(e,l,o);return n(e,l,i)},defaults:t}}();const a={},s={},d=(e,t)=>{s[e]=Object.assign({},s[e],t),a[e]&&a[e].forEach((e=>e(t)))},c=(e,t)=>(a[e]=a[e]||[],a[e].push(t),e in s&&t(s[e]),()=>{a[e]=a[e].filter((e=>e!=t))}),u=({name:e,module:t,dependencies:r,node:o,templates:a,signal:s,register:u})=>{var m;let p,h=[];const b=t.model||{},v=new Function(`return ${o.getAttribute("html-model")||"{}"}`)(),g=o.getAttribute("tplid"),y=o.getAttribute("html-scopeid"),A=a[g],E=n.scope[y],N=(S=(null==(m=null==t?void 0:t.model)?void 0:m.apply)?b({elm:o,initialState:v}):b,JSON.parse(JSON.stringify(S)));var S;const k=Object.assign({},E,N,v),M=t.view?t.view:e=>e,T={name:e,model:N,elm:o,template:A.template,dependencies:r,publish:d,subscribe:c,main(e){o.addEventListener(":mount",e)},state:{protected(e){if(!e)return h;h=e},save(e){e.constructor===Function?e(k):Object.assign(k,e)},set(e){if(!document.body.contains(o))return;e.constructor===Function?e(k):Object.assign(k,e);const t=Object.assign({},k,E);return new Promise((e=>{C(t,(()=>e(t)))}))},get:()=>Object.assign({},k)},on(e,t,n){n?(n.handler=e=>{const r=e.detail||{};let l=e.target;for(;l&&(l.matches(t)&&(e.delegateTarget=l,n.apply(o,[e].concat(r.args))),l!==o);)l=l.parentNode},o.addEventListener(e,n.handler,{signal:s,capture:"focus"==e||"blur"==e||"mouseenter"==e||"mouseleave"==e})):(t.handler=e=>{e.delegateTarget=o,t.apply(o,[e].concat(e.detail.args))},o.addEventListener(e,t.handler,{signal:s}))},off(e,t){t.handler&&o.removeEventListener(e,t.handler)},trigger(e,t,n){t.constructor===String?Array.from(o.querySelectorAll(t)).forEach((t=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:{args:n}}))})):o.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:{args:n}}))},emit(e,t){o.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:{args:t}}))},unmount(e){o.addEventListener(":unmount",e)},innerHTML(e,t){const n=t?e:o,r=n.cloneNode(),l=t||e;r.innerHTML=l,i.morph(n,r)}},C=(e,t=()=>{})=>{clearTimeout(p),p=setTimeout((()=>{const r=A.render.call(M(e),o,l,n);i.morph(o,r,f(o,u)),Promise.resolve().then((()=>{o.querySelectorAll("[tplid]").forEach((t=>{const n=u.get(t);n&&(n.state.protected().forEach((t=>delete e[t])),n.state.set(e))})),Promise.resolve().then((()=>{n.scope={},t()}))}))}))};return C(k),u.set(o,T),t.default(T)},f=(e,t)=>({callbacks:{beforeNodeMorphed(n){if(1===n.nodeType){if("html-static"in n.attributes)return!1;if(t.get(n)&&n!==e)return!1}}}}),m=new WeakMap,p=({component:e,templates:t,start:n})=>{const{name:r,module:o,dependencies:l}=e;return class extends HTMLElement{constructor(){super()}connectedCallback(){this.abortController=new AbortController,this.getAttribute("tplid")||n(this.parentNode);const e=u({node:this,name:r,module:o,dependencies:l,templates:t,signal:this.abortController.signal,register:m});e&&e.constructor===Promise?e.then((()=>{this.dispatchEvent(new CustomEvent(":mount"))})):this.dispatchEvent(new CustomEvent(":mount"))}disconnectedCallback(){this.dispatchEvent(new CustomEvent(":unmount")),this.abortController.abort()}}},h={},b={tags:["{{","}}"]},v=e=>{const t=JSON.stringify(e);return new Function("$element","safe","$g",`\n\t\tvar $data = this;\n\t\twith( $data ){\n\t\t\tvar output=${t.replace(/%%_=(.+?)_%%/g,(function(e,t){return'"+safe(function(){return '+r(t)+';})+"'})).replace(/%%_(.+?)_%%/g,(function(e,t){return'";'+r(t)+'\noutput+="'}))};return output;\n\t\t}\n\t`)},g=(e,t)=>{e.querySelectorAll(t.toString()).forEach((e=>{if("template"===e.localName)return g(e.content,t);e.setAttribute("tplid",o()),e.getAttribute("html-if")&&!e.id&&(e.id=o())}))},y=e=>{e.querySelectorAll("template, [html-for], [html-if], [html-inner], [html-class]").forEach((e=>{const t=e.getAttribute("html-for"),n=e.getAttribute("html-if"),r=e.getAttribute("html-inner"),o=e.getAttribute("html-class");if(t){e.removeAttribute("html-for");const n=t.match(/(.*)\sin\s(.*)/)||"",r=n[1],o=n[2],l=o.split(/\./).shift(),i=document.createTextNode(`%%_ ;(function(){ var $index = 0; for(var $key in safe(function(){ return ${o} }) ){ var $scopeid = Math.random().toString(36).substring(2, 9); var ${r} = ${o}[$key]; $g.scope[$scopeid] = Object.assign({}, { ${l}: ${l} }, { ${r} :${r}, $index: $index, $key: $key }); _%%`),a=document.createTextNode("%%_ $index++; } })() _%%");N(i,e,a)}if(n){e.removeAttribute("html-if");const t=document.createTextNode(`%%_ if ( safe(function(){ return ${n} }) ){ _%%`),r=document.createTextNode("%%_ }  _%%");N(t,e,r)}r&&(e.removeAttribute("html-inner"),e.innerHTML=`%%_=${r}_%%`),o&&(e.removeAttribute("html-class"),e.className=(e.className+` %%_=${o}_%%`).trim()),"template"===e.localName&&y(e.content)}))},A=(e,t)=>{Array.from(e.querySelectorAll("[tplid]")).reverse().forEach((e=>{const n=e.getAttribute("tplid"),r=e.localName;if(e.setAttribute("html-scopeid","jails___scope-id"),r in t&&t[r].module.template){const n=e.innerHTML,o=t[r].module.template({elm:e,children:n});e.innerHTML=o}const o=(e=>{const t=new RegExp(`\\${b.tags[0]}(.+?)\\${b.tags[1]}`,"g");return e.replace(/jails___scope-id/g,"%%_=$scopeid_%%").replace(t,"%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scopeid"===t?e:n?`${t}="%%_=safe(function(){ return ${n=n.replace(/^{|}$/g,"")} })_%%"`:e))})(e.outerHTML);h[n]={template:o,render:v(o)}}))},E=e=>{e.querySelectorAll("template").forEach((e=>{if(e.getAttribute("html-if")||e.getAttribute("html-inner"))return;E(e.content);const t=e.parentNode;if(t){const n=e.content;for(;n.firstChild;)t.insertBefore(n.firstChild,e);t.removeChild(e)}}))},N=(e,t,n)=>{var r,o;null==(r=t.parentNode)||r.insertBefore(e,t),null==(o=t.parentNode)||o.insertBefore(n,t.nextSibling)},S={},k=(e=document.body)=>{const t=((e,{components:t})=>{g(e,[...Object.keys(t),"[html-if]","template"]);const n=e.cloneNode(!0);return y(n),E(n),A(n,t),h})(e,{components:S});Object.values(S).forEach((({name:e,module:n,dependencies:r})=>{customElements.get(e)||customElements.define(e,p({component:{name:e,module:n,dependencies:r},templates:t,start:k}))}))};e.publish=d,e.register=(e,t,n)=>{S[e]={name:e,module:t,dependencies:n}},e.start=k,e.subscribe=c,e.templateConfig=e=>{var t;t=e,Object.assign(b,t)},Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=jails.js.map
