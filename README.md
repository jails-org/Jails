<p align="center">
  <img  src="https://jails-org.github.io/images/logo.svg" width="180" />
</p>

> ### "Simplicity is the Ultimate Sophistication"

# [![npm version](https://badge.fury.io/js/jails-js.svg?v4)](https://badge.fury.io/js/jails-js) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 🇧🇷

### An Alternative for Vanilla Javascript Applications <br />

- [**Documentation**](https://jails-org.github.io)
- [**Blog**](https://medium.com/jails-org)
- [**Demos**](https://codesandbox.io/search?query=jails-js)

<br />

### Download Boilerplate

[ Html Static Boilerplate ](https://github.com/jails-org/Boilerplate/archive/master.zip) ⤓

## Code Show

**index.htm**

```html
...
<div class="range" data-component="range">
	<label>Weight: <strong class="number">75</strong> kg</label><br />
	<input type="range" name="weight" min="10" max="200" value="75" />
</div>
...
```

**components/range/index.js**

```js
export default function range ({ main, elm }) {

    const number = elm.querySelector('.number')

    main( _ =>[
        register
    ])

    const register = ({ on }) => {
        on('input', 'input[type=range]', update )
    }

    const update = event => {
        number.innerText = event.target.value
    }
})
```

### With State Management

```html
...
<div class="range" data-component="range">
	<label>Weight: <strong class="number" v-html="number">75</strong> kg</label
	><br />
	<input type="range" name="weight" min="10" max="200" value="75" data-static />
</div>

// Or using template tags

<div class="range" data-component="range">
	<template>
		<label>Weight: <strong class="number">{{ number }}</strong> kg</label><br />
		<input
			type="range"
			name="weight"
			min="10"
			max="200"
			value="75"
			data-static
		/>
	</template>
</div>
```

**components/range/index.js**

```js
export default function range ({ main, msg }) {

    main( _ =>[
        register
    ])

    const register = ({ on }) => {
        on('input', 'input[type=range]', update )
    }

    const update = event => {
	msg.set( state => state.number = event.target.value )
    }
})

export const model = {
    number: 75
}
```

<br />

## ScreenCast Demo

<p>
<a target="_blank" href="https://www.youtube.com/watch?v=0tziV17wT5g"><img width="300" src="http://i3.ytimg.com/vi/0tziV17wT5g/maxresdefault.jpg" /></a>
</p>

## License

[MIT](http://opensource.org/licenses/MIT)
