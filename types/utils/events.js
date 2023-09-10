const customEvent = (() => {
    return ('CustomEvent' in window && typeof window.CustomEvent === 'function')
        ? (name, data) => new CustomEvent(name, data)
        : (name, data) => {
            const newEvent = document.createEvent('CustomEvent');
            newEvent.initCustomEvent(name, true, true, data);
            return newEvent;
        };
})();
const handler = (node, ev) => {
    return function (e) {
        const scope = this;
        const detail = e.detail || {};
        node.__events[ev].forEach(o => {
            o.handler.apply(scope, [e].concat(detail.args));
        });
    };
};
const removeListener = (node, ev) => {
    if (node.__events[ev] && node.__events[ev].listener) {
        node.removeEventListener(ev, node.__events[ev].listener, (ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'));
        delete node.__events[ev];
    }
};
const delegate = (node, selector, callback) => {
    return function (e) {
        const element = this;
        const detail = e.detail || {};
        let parent = e.target;
        while (parent) {
            if (parent.matches(selector)) {
                e.delegateTarget = parent;
                callback.apply(element, [e].concat(detail.args));
            }
            if (parent === node)
                break;
            parent = parent.parentNode;
        }
    };
};
export const on = (node, ev, selectorOrCallback, callback) => {
    node.__events = node.__events || {};
    node.__events[ev] = (node.__events[ev] || []);
    if (!node.__events[ev].length) {
        const fn = handler(node, ev);
        node.addEventListener(ev, fn, (ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'));
        node.__events[ev].listener = fn;
    }
    if (selectorOrCallback.call) {
        node.__events[ev].push({ handler: selectorOrCallback, callback: selectorOrCallback });
    }
    else {
        node.__events[ev].push({ handler: delegate(node, selectorOrCallback, callback), callback });
    }
};
export const off = (node, ev, fn) => {
    if (fn && node.__events[ev] && node.__events[ev].length) {
        var old = node.__events[ev];
        node.__events[ev] = node.__events[ev].filter(function (o) { return o.callback != fn; });
        node.__events[ev].listener = old.listener;
        if (!node.__events[ev].length)
            removeListener(node, ev);
    }
    else {
        removeListener(node, ev);
    }
};
export const trigger = (node, name, args) => {
    node.dispatchEvent(customEvent(name, { bubbles: true, detail: args }));
};
