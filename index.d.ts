type EventCallback = ( Event: Event, data?:any ) => void

declare const html = ( value :string ) => string

declare const _default: {
	publish( subject: string, data :any )
	subscribe( subject: string, callback: ((data: any ) => void) )
    register(name: string, module: Module, dependencies?: any): void
    start( target?:Element): void
	templateConfig( options: any ): void
}

export default _default
export const html

export type Module = {
	default: ((component:Component) => Promise<void> | void )
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
		getRaw() : object
	}

	main( mainArgs: ( t: Component ) => Array<Function> | void ): void

	publish( name: string, value: any ) : void

	subscribe( name: string, value: Function ) : Function

	template( data: object ) : void

	unmount( callback: () => void ) : void

	onupdate( callback: () => void ) : void

	on( eventName: string, selector: string | EventCallback, callback?: EventCallback ): void

	emit( eventName: string, data: any ) : void

	off( eventName: string, callback: () => void ): void

	trigger( eventName: string, selector :string, data: any ): void

	render( data: object ) : void

	innerHTML( target: HTMLElement | string, html: string? ) : void
}

export type Model = {
	[key: string] : object
}

export type View = ( state: object ) => object


