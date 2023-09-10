export default function Component(elm: any, { module, dependencies, templates, components, $scopes }: {
    module: any;
    dependencies: any;
    templates: any;
    components: any;
    $scopes: any;
}): {
    base: {
        template: any;
        elm: any;
        dependencies: any;
        publish: (name: any, params: any) => void;
        subscribe: (name: any, method: any) => () => void;
        main(fn: any): void;
        unmount(fn: any): void;
        onupdate(fn: any): void;
        on(eventName: any, selectorOrCallback: any, callback: any): void;
        off(eventName: any, callback: any): void;
        trigger(eventName: any, target: any, args: any): void;
        emit: (...args: any[]) => void;
        state: {
            set(data: any): Promise<unknown>;
            get(): any;
            getRaw(): any;
        };
        render(data?: any): void;
    };
    options: {
        main: (a: any) => any;
        unmount: (a: any) => any;
        onupdate: (a: any) => any;
        view: any;
    };
};
