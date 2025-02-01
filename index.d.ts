type EventCallback = ( Event: Event, data?:any ) => void

export type subscribe = ( subject: string, callback: (data:any) => void ) => Function
export type publish = ( subject: string, data :any ) => void
export type start = ( target?:HTMLElement ) => void
export type register = (name: string, module: Module, dependencies?: any) => void
export type templateConfig = ({ tags: Array }) => void

export type Module = {
	default: ((component:Component) => Promise<void> | void )
	Model?: Model
	View?: View
}

export type Component = {

	elm: HTMLElement
	dependencies: any

	state : {
		protected( props: Array<string> ): Array<string>
		set( data: object ) : Promise<any>
		set( callback: ( state: object ) => any ) : Promise<any>
		get() : object
		getRaw() : object
	}

	main( mainArgs: ( t: Component ) => void ): void

	publish( name: string, value: any ) : void

	subscribe( name: string, value: Function ) : Function

	unmount( callback: () => void ) : void

	on( eventName: string, selector: string | EventCallback, callback?: EventCallback ): void

	emit( eventName: string, data: any ) : void

	off( eventName: string, callback: () => void ): void

	trigger( eventName: string, selector :string, data: any ): void

	innerHTML( target: HTMLElement | string, html?: string ) : void
}

export type Model = {
	[key: string] : object
}

export type View = ( state: object ) => object

export type Template = ({ elm: HTMLElement, children: string }) => string
