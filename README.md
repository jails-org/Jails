<p align="center">
  <img  src="https://jails-org.github.io/images/logo.svg" width="180" />
</p>

> ### "Simplicity is the Ultimate Sophistication"

# [![npm version](https://badge.fury.io/js/jails-js.svg?v4)](https://badge.fury.io/js/jails-js)  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### A Simple Javascript Application Library <br />
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
<br />

## ScreenCast Demo
<p>
<a target="_blank" href="https://www.youtube.com/watch?v=0tziV17wT5g"><img width="300" src="http://i3.ytimg.com/vi/0tziV17wT5g/maxresdefault.jpg" /></a>
</p>

<br />

## Browsers support <sub><sup><sub><sub>made by <a href="https://godban.github.io">godban</a></sub></sub></sup></sub>

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions


*IE11 might need some polyfills in order to work (Promise)*


<br />

## License
[MIT](http://opensource.org/licenses/MIT)

