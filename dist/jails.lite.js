!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("jails",[],n):"object"==typeof exports?exports.jails=n():e.jails=n()}(window,(function(){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=3)}([function(e,n,t){var o;!function(n){var r,i,u=(r={},i={},{publish:function(e,n){e in r?p(r[e],(function(e){e(n)})):i[e]=n},subscribe:function(e,n){r[e]=r[e]||[],r[e].push(n),e in i&&p(r[e],(function(n){n(i[e])}))},unsubscribe:function(e){r[e.name]=(r[e.name]||[]).filter((function(n){return n!=e.method})),i[e.name]=(i[e.name]||[]).filter((function(n){return n!=e.method})),r[e.name].length||delete r[e.name],i[e.name].length||delete i[e.name]}});function c(e,n,t){return c.components[e]=n,c.components[e].options=t||{},c}function s(e){"childList"==e.type&&(e.addedNodes.length?a(e.addedNodes,l):e.removedNodes.length&&a(e.removedNodes,c.destroy))}function a(e,n){p(Array.prototype.slice.call(e).reduce((function(e,n){return n.querySelectorAll?[n].concat(Array.prototype.slice.call(n.querySelectorAll("[data-component]"))):[n]}),[]),(function(e){e.getAttribute&&e.getAttribute("data-component")&&n(e)}),!0)}function l(e){p(e.getAttribute("data-component").split(/\s/),function(e){return function(n){var t,o;e.j=e.j||{},n in c.components&&!e.j[n]&&(o=c.components[n],e.j[n]={methods:{}},function(e){d(()=>d(e))}(()=>{t=c.component(n,e,o.options),o(t,e,t.props),t.__initialize(t)}))}}(e))}function f(e,n){return n.toUpperCase()}function p(e,n,t){for(var o=0,r=(e=t?Array.prototype.slice.call(e).reverse():e).length;o<r;o++)e[o]&&n(e[o],o,e)}function d(e){(requestAnimationFrame||setTimeout)(e,1e3/60)}c.observer=null,c.events=function(){var e="CustomEvent"in window&&"function"==typeof window.CustomEvent?function(e,n){return new CustomEvent(e,n)}:function(e,n){var t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!0,!0,n),t};function n(e,n){e.__events[n]&&e.__events[n].listener&&(e.removeEventListener(n,e.__events[n].listener,"focus"==n||"blur"==n||"mouseenter"==n||"mouseleave"==n),delete e.__events[n])}function t(e,n,t){return function(o){for(var r=o.target,i=o.detail||{};r&&r!==e;)r.matches(n)&&(o.delegateTarget=r,t.apply(this,[o].concat(i.args))),r=r.parentNode}}return{on:function(e,n,o){if(e.__events=e.__events||{},e.__events[n]=e.__events[n]||[],!e.__events[n].length){var r=function(e,n){return function(t){var o=this,r=t.detail||{};e.__events[n].forEach((function(e){e.handler.apply(o,[t].concat(r.args))}))}}(e,n);e.addEventListener(n,r,"focus"==n||"blur"==n||"mouseenter"==n||"mouseleave"==n),e.__events[n].listener=r}o.call?e.__events[n].push({handler:o,callback:o}):Object.keys(o).forEach((function(r){e.__events[n].push({handler:t(e,r,o[r]),callback:o[r]})}))},off:function(e,t,o){if(o&&e.__events[t]&&e.__events[t].length){var r=e.__events[t];e.__events[t]=e.__events[t].filter((function(e){return e.callback!=o})),e.__events[t].listener=r.listener,e.__events[t].length||n(e,t)}else n(e,t)},trigger:function(n,t,o){n.dispatchEvent(e(t,{bubbles:!0,detail:o}))}}}(),c.components={},c.publish=u.publish,c.subscribe=u.subscribe,c.start=function(e){var n;return p((e=e||document.documentElement).querySelectorAll("[data-component]"),l,!0),c.observer=c.observer||((n=new MutationObserver((function(e){e.forEach(s)}))).observe(document.body,{childList:!0,subtree:!0}),n),c},c.destroy=function(e){if(e.__events){for(var n in c.events.trigger(e,":destroy"),e.__events)c.events.off(e,n);e.__events=null,e.j=null}},c.use=function(e){return e(c),c},c.extends=function(e){var n,t;return c.component=(n=e,t=c.component,function(){return n(t.apply(null,arguments))}),c},c.component=function(e,n,t){var o,r,i={},s=c.events,a=[],l=new Promise((function(e){r=e}));return s.on(n,":destroy",(function(){a.forEach((function(e){u.unsubscribe(e)}))})),o={name:e,elm:n,publish:u.publish,injection:t.injection,jails:c,__initialize:function(e){r(e)},main:function(e){e&&e.call&&l.then(function(e){return function(n){var t=e(n);if(t&&t.forEach){var o={};t.forEach((function(e){o=(e&&e.call?e(n,o):null)||o}))}}}(e))},init:function(e){o.main(e)},expose:function(t,o){n.j[e].methods=t},on:function(e,t){s.on(n,e,t)},off:function(e,t){s.off(n,e,t)},trigger:function(e,t,o){t.constructor==String?s.trigger(n.querySelector(t),e,{args:o}):s.trigger(n,e,{args:t})},props:function(e){return i.props=i.props||function(e){var n={data:{}};return p(e.attributes,function(e){return function(n){var t,o=n.name.split(/data\-/);try{t=n.value in window?n.value:new Function("return "+n.value)()}catch(e){t=n.value}return o[1]?e.data[o.pop().replace(/-([a-z])/g,f)]=t:e[n.name]=t,e}}(n)),n}(n),e?i.props[e]:i.props},get:function(e,t){return function(){var o=Array.prototype.slice.call(arguments),r=o.shift(),i="[data-component*="+e+"]";t=t?i+t:i,p(n.querySelectorAll(t),(function(n){n.j&&n.j[e]&&r in n.j[e].methods&&n.j[e].methods[r].apply(null,o)})),n.matches(t)&&n.j&&n.j[e]&&r in n.j[e].methods&&n.j[e].methods[r].apply(null,o)}},emit:function(e,t){var o=Array.prototype.slice.call(arguments);s.trigger(n,o.shift(),{args:o})},subscribe:function(e,n){a.push({name:e,method:n}),u.subscribe(e,n)}}},void 0===(o=function(){return c}.call(n,t,n,e))||(e.exports=o)}(window)},,,function(e,n,t){"use strict";t.r(n);var o=t(0),r=t.n(o);t.d(n,"default",(function(){return r.a}))}])}));