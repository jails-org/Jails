!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).jails={})}(this,(function(e){"use strict";document.createElement("textarea");const t={scope:{}},n=e=>requestAnimationFrame?requestAnimationFrame(e):setTimeout(e,1e3/60),r=(e,t)=>{try{return e()}catch(n){return t||""}};var o=function(){let e=new Set,t={morphStyle:"outerHTML",callbacks:{beforeNodeAdded:c,afterNodeAdded:c,beforeNodeMorphed:c,afterNodeMorphed:c,beforeNodeRemoved:c,afterNodeRemoved:c,beforeAttributeUpdated:c,beforeNodePantried:c},head:{style:"merge",shouldPreserve:function(e){return"true"===e.getAttribute("im-preserve")},shouldReAppend:function(e){return"true"===e.getAttribute("im-re-append")},shouldRemove:c,afterHeadMorphed:c}};function n(e,t,r){var a,i;if(r.head.block){let o=e.querySelector("head"),l=t.querySelector("head");if(o&&l){let a=d(l,o,r);return void Promise.all(a).then((function(){n(e,t,Object.assign(r,{head:{block:!1,ignore:!0}}))}))}}if("innerHTML"===r.morphStyle)return l(t,e,r),r.config.twoPass&&E(e,r),Array.from(e.children);if("outerHTML"!==r.morphStyle&&null!=r.morphStyle)throw"Do not understand how to morph style "+r.morphStyle;{let n=function(e,t,n){let r;r=e.firstChild;let o=r,l=0;for(;r;){let e=g(r,t,n);e>l&&(o=r,l=e),r=r.nextSibling}return o}(t,e,r),l=null!=(a=null==n?void 0:n.previousSibling)?a:null,s=null!=(i=null==n?void 0:n.nextSibling)?i:null,d=o(e,n,r);if(!n)return[];if(d){const e=function(e,t,n){var r,o;let l=[],a=[];for(;null!=e;)l.push(e),e=e.previousSibling;let i=l.pop();for(;void 0!==i;)a.push(i),null==(r=t.parentElement)||r.insertBefore(i,t),i=l.pop();a.push(t);for(;null!=n;)l.push(n),a.push(n),n=n.nextSibling;for(;l.length>0;){const e=l.pop();null==(o=t.parentElement)||o.insertBefore(e,t.nextSibling)}return a}(l,d,s);return r.config.twoPass&&E(d.parentNode,r),e}}}function r(e,t){return!!t.ignoreActiveValue&&e===document.activeElement&&e!==document.body}function o(e,t,n){var o,a;return n.ignoreActive&&e===document.activeElement?null:null==t?!1===n.callbacks.beforeNodeRemoved(e)?e:(null==(o=e.parentNode)||o.removeChild(e),n.callbacks.afterNodeRemoved(e),null):m(e,t)?(!1===n.callbacks.beforeNodeMorphed(e,t)||(e instanceof HTMLHeadElement&&n.head.ignore||(e instanceof HTMLHeadElement&&"morph"!==n.head.style?d(t,e,n):(i(t,e,n),r(e,n)||l(t,e,n))),n.callbacks.afterNodeMorphed(e,t)),e):!1===n.callbacks.beforeNodeRemoved(e)||!1===n.callbacks.beforeNodeAdded(t)?e:(null==(a=e.parentNode)||a.replaceChild(t,e),n.callbacks.afterNodeAdded(t),n.callbacks.afterNodeRemoved(e),t)}function l(e,t,n){e instanceof HTMLTemplateElement&&t instanceof HTMLTemplateElement&&(e=e.content,t=t.content);let r,l=e.firstChild,a=t.firstChild;for(;l;){if(r=l,l=r.nextSibling,null==a){if(n.config.twoPass&&n.persistentIds.has(r.id))t.appendChild(r);else{if(!1===n.callbacks.beforeNodeAdded(r))continue;t.appendChild(r),n.callbacks.afterNodeAdded(r)}k(n,r);continue}if(f(r,a,n)){o(a,r,n),a=a.nextSibling,k(n,r);continue}let i=h(e,t,r,a,n);if(i){a=p(a,i,n),o(i,r,n),k(n,r);continue}let s=b(e,t,r,a,n);if(s)a=p(a,s,n),o(s,r,n),k(n,r);else{if(n.config.twoPass&&n.persistentIds.has(r.id))t.insertBefore(r,a);else{if(!1===n.callbacks.beforeNodeAdded(r))continue;t.insertBefore(r,a),n.callbacks.afterNodeAdded(r)}k(n,r)}}for(;null!==a;){let e=a;a=a.nextSibling,y(e,n)}}function a(e,t,n,r){return!("value"!==e||!r.ignoreActiveValue||t!==document.activeElement)||!1===r.callbacks.beforeAttributeUpdated(e,t,n)}function i(e,t,n){let o=e.nodeType;if(1===o){const r=e,o=t,l=r.attributes,i=o.attributes;for(const e of l)a(e.name,o,"update",n)||o.getAttribute(e.name)!==e.value&&o.setAttribute(e.name,e.value);for(let e=i.length-1;0<=e;e--){const t=i[e];if(t&&!r.hasAttribute(t.name)){if(a(t.name,o,"remove",n))continue;o.removeAttribute(t.name)}}}8!==o&&3!==o||t.nodeValue!==e.nodeValue&&(t.nodeValue=e.nodeValue),r(t,n)||function(e,t,n){if(e instanceof HTMLInputElement&&t instanceof HTMLInputElement&&"file"!==e.type){let r=e.value,o=t.value;s(e,t,"checked",n),s(e,t,"disabled",n),e.hasAttribute("value")?r!==o&&(a("value",t,"update",n)||(t.setAttribute("value",r),t.value=r)):a("value",t,"remove",n)||(t.value="",t.removeAttribute("value"))}else if(e instanceof HTMLOptionElement&&t instanceof HTMLOptionElement)s(e,t,"selected",n);else if(e instanceof HTMLTextAreaElement&&t instanceof HTMLTextAreaElement){let r=e.value,o=t.value;if(a("value",t,"update",n))return;r!==o&&(t.value=r),t.firstChild&&t.firstChild.nodeValue!==r&&(t.firstChild.nodeValue=r)}}(e,t,n)}function s(e,t,n,r){if(!(e instanceof Element&&t instanceof Element))return;const o=e[n];if(o!==t[n]){let l=a(n,t,"update",r);l||(t[n]=e[n]),o?l||t.setAttribute(n,o):a(n,t,"remove",r)||t.removeAttribute(n)}}function d(e,t,n){let r=[],o=[],l=[],a=[],i=n.head.style,s=new Map;for(const c of e.children)s.set(c.outerHTML,c);for(const c of t.children){let e=s.has(c.outerHTML),t=n.head.shouldReAppend(c),r=n.head.shouldPreserve(c);e||r?t?o.push(c):(s.delete(c.outerHTML),l.push(c)):"append"===i?t&&(o.push(c),a.push(c)):!1!==n.head.shouldRemove(c)&&o.push(c)}a.push(...s.values());let d=[];for(const c of a){let e=document.createRange().createContextualFragment(c.outerHTML).firstChild;if(!1!==n.callbacks.beforeNodeAdded(e)){if("href"in e&&e.href||"src"in e&&e.src){let t,n=new Promise((function(e){t=e}));e.addEventListener("load",(function(){t()})),d.push(n)}t.appendChild(e),n.callbacks.afterNodeAdded(e),r.push(e)}}for(const c of o)!1!==n.callbacks.beforeNodeRemoved(c)&&(t.removeChild(c),n.callbacks.afterNodeRemoved(c));return n.head.afterHeadMorphed(t,{added:r,kept:l,removed:o}),d}function c(){}function u(){const e=document.createElement("div");return e.hidden=!0,document.body.insertAdjacentElement("afterend",e),e}function f(e,t,n){return null!=e&&null!=t&&(e instanceof Element&&t instanceof Element&&e.tagName===t.tagName&&(""!==e.id&&e.id===t.id||M(n,e,t)>0))}function m(e,t){return null!=e&&null!=t&&((!e.id||e.id===t.id)&&(e.nodeType===t.nodeType&&e.tagName===t.tagName))}function p(e,t,n){let r=e;for(;r!==t;){let e=r;r=e.nextSibling,y(e,n)}return k(n,t),t.nextSibling}function h(e,t,n,r,o){let l=M(o,n,t),a=null;if(l>0){a=r;let t=0;for(;null!=a;){if(f(n,a,o))return a;if(t+=M(o,a,e),t>l)return null;a=a.nextSibling}}return a}function b(e,t,n,r,o){let l=r,a=n.nextSibling,i=0;for(;null!=l;){if(M(o,l,e)>0)return null;if(m(l,n))return l;if(m(l,a)&&(i++,a=a.nextSibling,i>=2))return null;l=l.nextSibling}return l}const v=new WeakSet;function g(e,t,n){return m(t,e)?.5+M(n,e,t):0}function y(t,n){var r;if(k(n,t),n.config.twoPass&&function(t,n){for(const r of t.idMap.get(n)||e)if(t.persistentIds.has(r))return!0;return!1}(n,t)&&t instanceof Element)A(t,n);else{if(!1===n.callbacks.beforeNodeRemoved(t))return;null==(r=t.parentNode)||r.removeChild(t),n.callbacks.afterNodeRemoved(t)}}function A(e,t){var n;if(!1!==t.callbacks.beforeNodePantried(e))if(Array.from(e.childNodes).forEach((e=>{A(e,t)})),t.persistentIds.has(e.id))t.pantry.moveBefore?t.pantry.moveBefore(e,null):t.pantry.insertBefore(e,null);else{if(!1===t.callbacks.beforeNodeRemoved(e))return;null==(n=e.parentNode)||n.removeChild(e),t.callbacks.afterNodeRemoved(e)}}function E(e,t){e instanceof Element&&(Array.from(t.pantry.children).reverse().forEach((n=>{var r;const o=e.querySelector(`#${n.id}`);if(o){if(null==(r=o.parentElement)?void 0:r.moveBefore)for(o.parentElement.moveBefore(n,o);o.hasChildNodes();)n.moveBefore(o.firstChild,null);else for(o.before(n);o.firstChild;)n.insertBefore(o.firstChild,null);!1!==t.callbacks.beforeNodeMorphed(n,o)&&(i(o,n,t),t.callbacks.afterNodeMorphed(n,o)),o.remove()}})),t.pantry.remove())}function N(e,t){return!e.deadIds.has(t)}function S(t,n,r){return(t.idMap.get(r)||e).has(n)}function k(t,n){let r=t.idMap.get(n)||e;for(const e of r)t.deadIds.add(e)}function M(t,n,r){let o=t.idMap.get(n)||e,l=0;for(const e of o)N(t,e)&&S(t,e,r)&&++l;return l}function T(e){let t=Array.from(e.querySelectorAll("[id]"));return e.id&&t.push(e),t}function $(e,t){let n=e.parentElement;for(const r of T(e)){let e=r;for(;e!==n&&null!=e;){let n=t.get(e);null==n&&(n=new Set,t.set(e,n)),n.add(r.id),e=e.parentElement}}}function w(e,t){let n=new Map;return $(e,n),$(t,n),n}function C(e,t){const n=e=>e.tagName+"#"+e.id,r=new Set(T(e).map(n));let o=new Set;for(const l of T(t))r.has(n(l))&&o.add(l.id);return o}return{morph:function(e,r,o={}){e instanceof Document&&(e=e.documentElement),"string"==typeof r&&(r=function(e){let t=new DOMParser,n=e.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,"");if(n.match(/<\/html>/)||n.match(/<\/head>/)||n.match(/<\/body>/)){let r=t.parseFromString(e,"text/html");if(n.match(/<\/html>/))return v.add(r),r;{let e=r.firstChild;return e?(v.add(e),e):null}}{let n=t.parseFromString("<body><template>"+e+"</template></body>","text/html").body.querySelector("template").content;return v.add(n),n}}(r));let l=function(e){if(null==e){return document.createElement("div")}if(v.has(e))return e;if(e instanceof Node){const t=document.createElement("div");return t.append(e),t}{const t=document.createElement("div");for(const n of[...e])t.append(n);return t}}(r),a=function(e,n,r){const o=function(e){let n=Object.assign({},t);return Object.assign(n,e),n.callbacks=Object.assign({},t.callbacks,e.callbacks),n.head=Object.assign({},t.head,e.head),n}(r);return{target:e,newContent:n,config:o,morphStyle:o.morphStyle,ignoreActive:o.ignoreActive,ignoreActiveValue:o.ignoreActiveValue,idMap:w(e,n),deadIds:new Set,persistentIds:o.twoPass?C(e,n):new Set,pantry:o.twoPass?u():document.createElement("div"),callbacks:o.callbacks,head:o.head}}(e,l,o);return n(e,l,a)},defaults:t}}();const l={},a={},i=(e,t)=>{a[e]=Object.assign({},a[e],t),l[e]&&l[e].forEach((e=>e(t)))},s=(e,t)=>(l[e]=l[e]||[],l[e].push(t),e in a&&t(a[e]),()=>{l[e]=l[e].filter((e=>e!=t))}),d=e=>({callbacks:{beforeNodeMorphed(t){if(1===t.nodeType){if("html-static"in t.attributes)return!1;if(t.base&&t!==e)return!1}}}}),c=({component:e,templates:l,start:a})=>{const{name:c,module:u,dependencies:f}=e,m=new AbortController;return class extends HTMLElement{constructor(){super()}connectedCallback(){this.getAttribute("tplid")||a(this.parentNode),(({name:e,module:l,dependencies:a,node:c,templates:u,signal:f})=>{var m;const p=l.model||{},h=new Function(`return ${c.getAttribute("html-model")||"{}"}`)(),b=c.getAttribute("tplid"),v=c.getAttribute("html-scope-id"),g=u[b],y=t.scope[v],A=(null==(m=null==l?void 0:l.model)?void 0:m.apply)?p({elm:c,initialState:h}):p,E=Object.assign({},y,A,h),N=l.view?l.view:e=>e;let S=[];const k={name:e,model:A,elm:c,template:g.template,dependencies:a,publish:i,subscribe:s,main(e){c.addEventListener(":mount",e)},state:{save(e){e.constructor===Function?e(E):Object.assign(E,e)},set(e){if(!document.body.contains(c))return;const t=e.constructor===Function?Object.assign({},e(E)):Object.assign(E,e);return S.push(e),new Promise((e=>{n((()=>{Object.assign.apply(null,[t,...S]),S.length&&(M(t),e(t),S=[])}))}))},get:()=>Object.assign({},E)},on(e,t,n){n?(n.handler=e=>{const r=e.detail||{};let o=e.target;for(;o&&(o.matches(t)&&(e.delegateTarget=o,n.apply(c,[e].concat(r.args))),o!==c);)o=o.parentNode},c.addEventListener(e,n.handler,{signal:f,capture:"focus"==e||"blur"==e||"mouseenter"==e||"mouseleave"==e})):(t.handler=e=>{e.delegateTarget=c,t.apply(c,[e].concat(e.detail.args))},c.addEventListener(e,t.handler,{signal:f}))},off(e,t){t.handler&&c.removeEventListener(e,t.handler)},trigger(e,t,n){t.constructor===String?Array.from(c.querySelectorAll(t)).forEach((t=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:{args:n}}))})):c.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:{args:n}}))},emit(e,t){c.dispatchEvent(new CustomEvent(e,{bubbles:!0,detail:{args:t}}))},unmount(e){c.addEventListener(":unmount",e)},innerHTML(e,t){const r=t?e:elm,l=r.cloneNode(),a=t||e;l.innerHTML=a,n((e=>o.morph(r,l,d)))}},M=e=>{const l=g.render.call(N(e),c,r,t);o.morph(c,l,d(c)),c.querySelectorAll("[tplid]").forEach((t=>{if(!t.base)return;const n=t.base,r=Object.keys(n.model).reduce(((t,n)=>(n in e&&(t||(t={}),t[n]=e[n]),t)),null);r&&n.state.set(r)})),n((()=>t.scope={}))};c.base=k,l.default(k)})({node:this,name:c,module:u,dependencies:f,templates:l,signal:m.signal}),this.dispatchEvent(new CustomEvent(":mount")),this.base.state.set({})}disconnectedCallback(){this.dispatchEvent(new CustomEvent(":unmount")),m.abort(),delete this.base}}},u={},f={tags:["{{","}}"]},m=e=>{const t=h(e),n=JSON.stringify(t);return new Function("$element","safe","$g",`\n\t\tvar $data = this;\n\t\twith( $data ){\n\t\t\tvar output=${n.replace(/%%_=(.+?)_%%/g,(function(e,t){return'"+safe(function(){return '+t+';})+"'})).replace(/%%_(.+?)_%%/g,(function(e,t){return'";'+t+'\noutput+="'}))};return output;\n\t\t}\n\t`)},p=(e,t)=>{e.querySelectorAll(t.toString()).forEach((e=>{if("template"===e.localName)return p(e.content,t);e.setAttribute("tplid",Math.random().toString(36).substring(2,9))}))},h=e=>{const t=new RegExp(`\\${f.tags[0]}(.+?)\\${f.tags[1]}`,"g");return e.replace(/jails___scope-id/g,"%%_=$scopeid_%%").replace(t,"%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g,"%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%").replace(/html-(.*?)=\"(.*?)\"/g,((e,t,n)=>"key"===t||"model"===t||"scope-id"===t?e:n?`${t}="%%_=safe(function(){ return ${n=n.replace(/^{|}$/g,"")} })_%%"`:e))},b=e=>{e.querySelectorAll("template, [html-for], [html-if], [html-inner], [html-class]").forEach((e=>{const t=e.getAttribute("html-for"),n=e.getAttribute("html-if"),r=e.getAttribute("html-inner"),o=e.getAttribute("html-class");if(t){e.removeAttribute("html-for");const n=t.match(/(.*)\sin\s(.*)/)||"",r=n[1],o=n[2],l=document.createTextNode(`%%_ ;(function(){ var $index = 0; for(var $key in safe(function(){ return ${o} }) ){ var $scopeid = Math.random().toString(36).substring(2, 9); var ${r} = ${o}[$key]; $g.scope[$scopeid] = { ${r} :${r}, ${o}: ${o}, $index: $index, $key: $key }; _%%`),a=document.createTextNode("%%_ $index++; } })() _%%");y(l,e,a)}if(n){e.removeAttribute("html-if");const t=document.createTextNode(`%%_ if ( safe(function(){ return ${n} }) ){ _%%`),r=document.createTextNode("%%_ } _%%");y(t,e,r)}r&&(e.removeAttribute("html-inner"),e.innerHTML=`%%_=${r}_%%`),o&&(e.removeAttribute("html-class"),e.className=(e.className+` %%_=${o}_%%`).trim()),"template"===e.localName&&b(e.content)}))},v=(e,t)=>{Array.from(e.querySelectorAll("[tplid]")).reverse().forEach((e=>{const n=e.getAttribute("tplid"),r=e.localName;if(e.setAttribute("html-scope-id","jails___scope-id"),r in t&&t[r].module.template){const o=e.innerHTML,l=t[r].module.template({elm:e,children:o});l.constructor===Promise?l.then((t=>{e.innerHTML=t;const r=e.outerHTML;u[n]={template:r,render:m(r)}})):e.innerHTML=l}const o=e.outerHTML;u[n]={template:o,render:m(o)}}))},g=e=>{e.querySelectorAll("template").forEach((e=>{if(e.getAttribute("html-if")||e.getAttribute("html-inner"))return;g(e.content);const t=e.parentNode;if(t){const n=e.content;for(;n.firstChild;)t.insertBefore(n.firstChild,e);t.removeChild(e)}}))},y=(e,t,n)=>{var r,o;null==(r=t.parentNode)||r.insertBefore(e,t),null==(o=t.parentNode)||o.insertBefore(n,t.nextSibling)},A={},E=(e=document.body)=>{const t=((e,{components:t})=>{p(e,[...Object.keys(t),"template"]);const n=e.cloneNode(!0);return b(n),g(n),v(n,t),u})(e,{components:A});Object.values(A).forEach((({name:e,module:n,dependencies:r})=>{customElements.get(e)||customElements.define(e,c({component:{name:e,module:n,dependencies:r},templates:t,start:E}))}))};e.publish=i,e.register=(e,t,n)=>{A[e]={name:e,module:t,dependencies:n}},e.start=E,e.subscribe=s,e.templateConfig=e=>{var t;t=e,Object.assign(f,t)},Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=jails.js.map
