# API Contracts

## Global APIs

```ts
register(name: string, module: object, dependencies?: object): void
start(target?: HTMLElement): void
templateConfig(options: { tags: [string, string] }): void
publish(name: string, params: any): void
subscribe(name: string, method: Function): Function
```

## Component Helper APIs

```ts
main(fn: Function): void
effect(fn?: Function): Function | void
query(selector: string): Array<Promise<HTMLElement>>
state.protected(keys?: string[]): string[]
state.save(data: object | Function): void
state.set(data: object | Function): Promise<object>
state.get(): object
dataset(key: string): any
dataset(target: HTMLElement, key: string): any
on(event: string, selector: string, callback: Function): void
on(event: string, callback: Function): void
off(event: string, callback: Function): void
trigger(event: string, selector: string, data?: any): void
emit(event: string, data: any): void
unmount(fn: Function): void
innerHTML(html: string): void
innerHTML(target: HTMLElement, html: string): void
```

## Module Exports

```ts
export default function controller(helpers) {}
export const model = {}
export const view = state => ({})
export const template = ({ elm, children }) => ''
```

## Stability Notes

- `tplid`, `html-scopeid`, and `globalThis.__jails__` are runtime internals.
- `html-static`, `html-if`, `html-for`, `html-inner`, `html-class`, `html-model`, and generic `html-*` are public directive contracts.

