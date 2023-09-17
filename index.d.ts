
declare const _default: {
    register(name: string, module: Module, dependencies?: any): void
    start(): void
	templateConfig( options: any ): void
}

export default _default

export type Module = {
	default: ((component:Component) => Promise<void> | null )
	Model?: Model
	View?: View
}

export type Component = {

	elm: HTMLElement
	dependencies: any

	state : {
		set( data: object ) : Promise
		set( callback: ( state: object ) => any ) : Promise
		get() : object
	}

	main( mainArgs: ( t: Component ) => Array<Function> ): void

	publish( name: string, value: any ) : void

	subscribe( name: string, value: Function ) : Function

	template( data: object ) : void

	unmount( callback: () => void ) : void

	onupdate( callback: () => void ) : void

	on( eventName: string, selector: string, callback: () => void ): void

	on( eventName: string, callback: () => void ): void

	emit( eventName: string, data: any ) : void

	off( eventName: string, callback: () => void ): void

	trigger( eventName: string, selector :string, data: any ): void

	render( data: object ) : void
}

export type Model = {
	[key: string] : object
}

export type View = ( state: object ) => object
