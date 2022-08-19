
export type Component = {

	elm: HTMLElement,

	dependencies: object,

	main( mainArgs: ( t: any ) => Array<Function> ): void

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

	state : {
		set( data: object ) : void
		set( callback: ( state: object ) => any ) : void
		get() : object
	}
}

export type Model = {
	[key: string] : object
}

export type View = ( state: object ) => object
