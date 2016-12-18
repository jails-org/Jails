
# Jails ||/|

> Modular, Event Driven & Non-obstructive Micro-Library

---

Jails is a javascript micro-library for building simple applications and large scale applications without a huge stack dependencies.

Good projects should rely on good architectures, and Jails aim to solve architecture and organization problems.
It's event driven and follows the DOM event pattern, low learning curve and trying to be predictable.

---

## Quick Setups

Here are some useful quick setups to help you to start your project. =)

![Webpack](http://webpack.github.io/assets/favicon.png) [Webpack setup](https://github.com/jails-org/Jails/raw/gh-pages/downloads/jails2-webpack.zip)

![RequireJS](https://raw.githubusercontent.com/legacy-icons/vendor-icons/master/dist/32x32/requirejs.png) [RequireJS setup](https://github.com/jails-org/Jails/raw/gh-pages/downloads/jails2-requirejs.zip)

![Vanilla](http://dev.bowdenweb.com/a/i/js/icons/javascript-icon-32.png) [Vanilla setup](https://github.com/jails-org/Jails/raw/gh-pages/downloads/jails2-vanilla.zip)

---

## Creating a Component

### Markup

```html
<form class="form" data-component="form">
	<input type="text" name="message" />
	<button>Send</button>
</form>

```

### Javascript
```js
jails('form', ( component, form, annotation ) =>{

	component.init = ()=>{
		component.on('change', 'input' onChange)
	}

	let onChange = (e)=>{
		console.log('Hey, some input has changed')
	}
})
```
---

## Component relashionships

### Passive way

Components can relate to each other using `events`:

- `.on()` : The same interface of jQuery to bind dom events.
- `.listen()`: Is the way to listen to custom *DOM* event fired by other Components.
- `.emit()` : Fires the custom *DOM* event.
- `.publish()` : Publish globally to every component in the page.
- `.subscribe()` : Subscribe to any global events.
- `.get()` : Get a function reference to a component.

#### Examples

Component A listen to Component B

```html
<div data-component="A">
	<div data-component="B">
		<button>Ok</button>
	</div>
</div>
```

*Component A*
```js
jails('A', (component, div, annotation)=>{

	component.init = ()=>{
		// To listen to a custom event, you need to follow the standard
		// componentName:stringEvent
		component.listen('B:click', e => console.log(e))
	}
})
```

*Component B*
```js
jails('B', (component, div, annotation) =>{

	component.init = ()=>{
		component.on('click', '.button', emit)
	}

	let emit = (e)=>{
		component.emit('click', e)
	}
})
```

### Active way

You can execute a public component method through other component.


#### Examples

Component A executes Component B public method.

```html
<div data-component="A">
	<div data-component="B">
		<button>Ok</button>
	</div>
</div>
```

*Component A*
```js
jails('A', (component, div, annotation)=>{

	//Getting B reference
	let B = component.get('[data-component*=B]')

	component.init = ()=>{
		B('update', { someOption:'bla bla bla' })
	}
})
```

*Component B*

```js
jails('B', ( component, div, annotation )=>{

	component.update = ( option )=>{
		console.log( option ) // { someOption:'bla bla bla' }
		component.publish('messageToALL', someOption) // Sends data to any component subscribed to 'messageToALL'.
	}
})
```

The `.get()` functions do not returns an instance, but a reference instead which is a `Function`. That's because you can have several components in the markup, all of them should execute the public method without the looping concerns:


```html
<div data-component="A">
	<p data-component="B"></p>
	<p data-component="B"></p>
	<p data-component="B"></p>
	<button>Ok</button>
</div>
```

`.get( CSSSelector )` method also expects a `CSSSelector` as a parameter you can grab the exactly component you want:

```html
<div data-component="A">
	<p data-component="B"></p>
	<p class="only-this-one" data-component="B"></p>
	<p data-component="B"></p>
	<button>Ok</button>
</div>
```

*Component A*
```js
jails('A', (component, div, annotation)=>{

	//Getting B reference
	let B = component.get('.only-this-one')

	component.init = ()=>{
		B('update', { someOption:'bla bla bla' }) // Only the second component will call .update() method.
	}
})
```
---

## Good to know

Components can live in the same markup:

```html
<div data-component="Z">
	<div class="dialog" data-component="modal view">
		<p>Hello {username}</p>
	</div>
</div>
```

And if both has the methods with the same name, you can distinct which component should respond to the call:
** Example, Modal and View components has the .update() method but you want that only View component to execute it **

```js
jails('Z', ( component, html, annotation )=>{

	let dialog = component.get('.dialog')

	component.init = ()=>{
		dialog('view:update', { username:'Clark Kent' })
	}
})
```

You can create a new component and compose it with the jails component interface to build your components:

```js
jails('My-Component', ( component, html, annotation )=>{

	// Returning a new component that uses the jails component interface
	return{

		init(){
			//Components supports event delegation!
			// You should always use that =)
			component.on('click', '.button', this.click)
		},

		click(){
			console.log('Hey I was clicked!')
		}
	})
})
```

if you don't want to return a component object, jails will use the component interface argument as default.

---

## Annotations

In order to build a generic component in some cases you need to let it configurable, without changing the source code.
You can use the html data attributes to accomplish that, or you can use Jails `@annotations`.

```html
	<!--@my-component({ target:'.other-element' })-->
	<a href="#" data-component="my-component">
		My Link component
	</a>
```

```js
	jails('my-component', (component, link, annotation)=>{

		component.init = ()=>{
			console.log( annotation.target ) // 'other-element'
		}

	})
```

Annotations is just a special comment, the name of component should be referenced in the comment using `@` prefix.
In the case with 2 or more components in the same markup:

```html
	<!--
		@A({  })
		@B({  })
		@C({  })
	-->
	<a href="#" data-component="A B C">
		My Link component
	</a>
```

**Annotations are optional, if you don't like to mix html comments with your js code, simply don't use it. =)**


---

## Api - Components

### .on( Event, Function )
Bind DOM events on the component itself.

### .on( Event, CssSelector, Function ) : Function off()
Event delegation, bind DOM events on component child nodes. Returns the `.off()` method to unbind the event.

### .trigger( element, event, [args] )
Trigger events on some element. Element is required…

### .emit( action, [ data ] )
Emit a custom event to be bubbled in the DOM tree.

### .listen( Event, Function )
Listen to custom events fired by Components or Controllers within the controller/app scope.

### .get( CssSelector )
Creates an reference to components, and returns a function, it accepts the name of public method and arguments to be sent as event. The previous example code illustrates that.

### .publish( Event, [args] )
Fires a global event to the ecosystem, very recommended to communicate Controllers and Apps with each other.

### .subscribe( Event, Function ) : Function unsubscribe
Subscribes the Controller/App to a global event. Returns a function to unsubscribe if necessary.


## Api - Jails

### Jails.start()
Start jails internal Scanner, which will scan entire html and instantiate the components.

### Jails.scanner
Scanner object, scans the html DOM tree and start components.

### Jails.render( DOMElement container, String html)
Replace html content of a container DOMElement, and destroy all components instances.

### Jails.refresh( [DOMElement container] )
Executes scanning again, if no option is passed, Jails will scan the entire DOM again.
It will bypass components already started, it will initialize only new dom elements created.

### Jails.events
Jails events object has `.on()`, `.off()`, `.trigger()` methods for events, also used on Components interface.
You can bypass these events making an *adapter*, using jQuery if you will.

### Jails.publish( `string`, `:any`) / Jails.subscribe( `string`, `:any`)
The same `.publish()` and `.subscribe()` events used on components interface, you can use it on third-party modules using the pub/sub pattern.

---

## Browser support

IE9 + and Modern Browsers.
