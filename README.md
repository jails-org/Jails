# Jails ||\\| - A Modular & Event Driven Micro-Framework

Jails is a javascript micro-framework for building simple applications and large scale applications without a huge stack dependencies.

Good projects should rely on good architectures, and Jails aim to solve architecture and organization problems.

It's event driven and follows the DOM event pattern, lowering the learning curve and trying to be predictable.

[Check out more information about  Jails](http://jails-org.github.io/Jails/)

## Quick Setups

![Webpack](http://webpack.github.io/assets/favicon.png) [Webpack setup](https://github.com/jails-org/Jails/raw/gh-pages/downloads/jails-webpack.zip)

![RequireJS](https://raw.githubusercontent.com/legacy-icons/vendor-icons/master/dist/32x32/requirejs.png) [RequireJS setup](https://github.com/jails-org/Jails/raw/gh-pages/downloads/jails-requirejs.zip)


## Examples

Let's get a message from a `<form />` and send it a list `<ul />`.

You just have to create a name for component and set it on markup.

```html
<form class="form" data-component="form-message">
	<input type="text" name="message" class="message" />
</form>
```

### component/form-message.js

Now we have to match that markup with the javascript `Function` mixin.

```js
jails.component('form-message', function( form, annotation ){

	this.init = ()=>{
		this.on('submit', send)
	}

	let send = (e)=>{

		var msg = form.querySelector('.message')
		self.emit('post', { message :msg.value })
		form.reset()

		e.preventDefault()
	}
})
```

### component/list-messages.js

We need a component to handle the messages adding actions:

```js
jails.component('list-messages', function( list, annotation ){

	this.init = ()=>{}

	this.add = ( message ) =>{
		list.innerHTML += `<li>${message}</li>`
	}
})
```

Public methods can be executed using events by other wrappers structures, like controllers.

Components knows nothing about other components, so we need a controller to make that relationship with `form-message` and `list-messages`.

### controller/box-message.js

Controllers deal with Business logic and Components relationships. The controller below `listen` to a bubling dom event `emmited` by `form-message` component, gets a reference of the list and fire up the `add` public method using event emitting.

```js
jails.controller('box-message', function(section, data){

	let list

	this.init = ()=>{
		list = this.x('.list')
		this.listen('form-message:post', onPost)
	}

	let onPost = (e, option) =>{
		list('add', option.message )
		this.publish('message:added', option.message)
	}
})
```

After that, controller `publishes` a message globally, to any other controllers/apps in the page. In this case, the `app` subscribe to that global publish event and logs it:

```js
jails.app('home', function(body, data){

	this.init = ()=>{
		console.log('App home loaded', body)
		this.subscribe('message:added', logMessage)
	}

	let logMessage = (e, message)=>{
		console.log('Message added => ', message)
	}
})

jails.start()

```

## Advantages

- Very small learning curve, only **6/7** methods to learn.
- Jails is short, minimalistic, and it weights almost **nothing**.
- Works pretty well with small projects and also with large scale applications.
- Doesn't depend on jQuery, events are native with `Event Delegation` support :

```js
jails.component('my-component', function( ulElement, annotation ){

	this.init = ()=>{
		this.on('click', '.my-link', onClick)
	}

	let onClick = (e)=>{
		alert( 'Hey You click meeee' )
		e.preventDefault()
	}
})
```

- Community dependent, Jails grows with community, you don't have to wait for a new Jails version to get a fresh and new `view` module, you can implement your own `component` and share it.

- Simplicity, it'll work very well with other libraries or micro-libraries.

- You don't have write html sintax on your js file, keep your js logic away from html markup.

And many others advantages...

### Go Pro

In the example above we made everything from scratch, but the idea is to write and save your components and reuse them later.

`Jails-org` already has some [components](http://jails-org.github.io/Jails/components.htm) and [modules](http://jails-org.github.io/Jails/modules.htm) ready to use.

You can also compose several components in the same markup, if you want to build a modal component which will only deal with DOM modifications to open a dialog and after that updating the content with `Virtual DOM`, you can do it just like that:

```html
<div class="modal" data-component="litemodal riot-view">
	<h1>My name is {username}</h1>
</div>
```

```js
// Importing from Jails-org repository
import 'jails-components/riot-view/riot-view'
import 'jails-components/litemodal/litemodal'

import jails from 'jails'

jails.controller('my-controller', function(){

	var modal = this.x('.modal')

	this.init = ()=>{
		this.on('click', 'a[rel=modal]', openModal)
	}

	let openModal = ()=>{
		modal('update', {  username :'Clark Kent' }) // Executes this.update() from riot-view component.
		modal('open') // Executes this.open() from litemodal component.
	}
})

```

Your controller should only deal with integration, and business logic. It should delegate DOM issues to components.

---

There's so much about Jails, please, check out the [Documentation](//jails-org.github.io/Jails/) and [Demos](//github.com/jails-org/Demos) to get the principles and fundamentals.

Jails works really well with [Riot.js](//riotjs.com/) for Virtual DOM templates, and [Redux Pattern](//redux.js.org).

There's a [TodoApp](https://github.com/jails-org/Demos/tree/master/TodoApp) already  using `Riot.js` + `Jails` + `Redux`.

Jails supports IE9+, but it can support IE8 if you use `jQuery` and then add the simple [Adapter](//github.com/jails-org/Modules/tree/master/jquery.adapter) already available in `Jails-org` modules.
