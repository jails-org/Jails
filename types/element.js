import Component from './component';
import { purge, rAF } from './utils';
export default function Element(module, dependencies, templates, components, $scopes) {
    return class extends HTMLElement {
        constructor() {
            super();
            Object.defineProperty(this, "base", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "options", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "returns", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "__events", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            const { base, options } = Component(this, { module, dependencies, templates, components, $scopes });
            this.base = base;
            this.options = options;
            this.returns = module.default(base);
        }
        connectedCallback() {
            var _a;
            this.base.render();
            if (this.returns && this.returns.constructor === Promise) {
                this.returns.then(_ => {
                    var _a;
                    if (this.base) {
                        (_a = this.options.main()) === null || _a === void 0 ? void 0 : _a.forEach(f => f(this.base));
                    }
                });
            }
            else {
                (_a = this.options.main()) === null || _a === void 0 ? void 0 : _a.forEach(f => f(this.base));
            }
        }
        disconnectedCallback() {
            this.options.unmount(this.base);
            rAF(() => {
                if (!document.body.contains(this)) {
                    this.__events ? this.__events = null : null;
                    this.base ? this.base.elm = null : null;
                    this.base ? this.base = null : null;
                    purge(this);
                }
            });
        }
        attributeChangedCallback() {
            //TODO
        }
    };
}
