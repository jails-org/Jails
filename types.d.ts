type EventCallback = ( Event: Event, data?:any ) => void

export declare const templateConfig: (options: any) => void;
export declare const register: (name: string, module: any, dependencies?: any) => void
export declare const start: (target?: HTMLElement) => void;
export declare const subscribe:( subject: string, callback: (data:any) => void ) => Function
export declare const publish: ( subject: string, data :any ) => void

export type Component = {

	elm: HTMLElement
	dependencies: any

	state : {
		protected( props: Array<string> ): Array<string>
		set( data: any ) : Promise<any>
		set( callback: ( state: object ) => any ) : Promise<any>
		get() : any
		getRaw() : any
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

	dataset( target: HTMLElement, key: string ) : any

	dataset( key: string ) : any

	attr( target?: HTMLElement ) : {
		change : ( attribute: string, callback: Function ) => void
		disconnect : ( callback: Function ) => void
	}

}

export type Model = {
	[key: string] : any
}

export type View = ( state: any ) => any

export type Template = ({ elm: HTMLElement, children: string }) => string
