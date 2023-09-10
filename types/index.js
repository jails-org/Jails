import { templateConfig, buildtemplates } from './template-system';
import Element from './element';
const templates = {};
const components = {};
const $scopes = {};
export default {
    templateConfig,
    register(name, module, dependencies) {
        components[name] = { name, module, dependencies };
    },
    start() {
        const body = document.body;
        buildtemplates(body, components, templates, $scopes);
        registerComponents();
    }
};
const registerComponents = () => {
    Object
        .values(components)
        .forEach((component) => {
        const { name, module, dependencies } = component;
        const Base = Element(module, dependencies, templates, components, $scopes);
        customElements.define(name, Base);
    });
};
