declare type MainArgs = () => Array<Function>;
export default function Component(elm: HTMLElement, { module, dependencies, templates, components }: {
    module: any;
    dependencies: any;
    templates: any;
    components: any;
}): {
    base: {
        template: any;
        elm: HTMLElement;
        dependencies: any;
        publish: (name: any, params: any) => void;
        subscribe: (name: any, method: any) => void;
        unsubscribe: (topic: any) => void;
        main(fn: MainArgs): void;
        unmount(fn: any): void;
        onupdate(fn: any): void;
        on(eventName: string, selectorOrCallback: object | Function, callback: Function): void;
        off(eventName: string, callback: Function): void;
        trigger(eventName: string, target: string, args: any): void;
        emit: (...args: any[]) => void;
        state: {
            set(data: any): Promise<unknown>;
            get(): any;
        };
        render(data?: object): void;
    };
    options: {
        main: (_: any) => any;
        unmount: (_: any) => any;
        onupdate: (_: any) => any;
        view: any;
    };
};
export {};
