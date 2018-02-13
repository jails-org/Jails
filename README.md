<p align="center">
  <img  src="https://jails-org.github.io/assets/jails.svg" width="140" height="160" />
</p>

# Jails · [![npm version](https://badge.fury.io/js/jails-js.svg)](https://badge.fury.io/js/jails-js)  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Next Generation Javascript Library <br />
- [**Documentation**](https://jails-org.github.io) 
- [**Blog**](https://medium.com/jails-org)

<br />

## Code Show

`index.htm`

```html
...
<div class="range" data-component="range">
    <label>Weight: <strong class="number">75</strong> kg</label><br />
    <input type="range" name="height" min="10" max="200" value="75" />
</div> 
...
```

`components/range/index.js`

```js
export default ( {init:main, elm} ) => {

    const number = elm.querySelector('.number')

    main(()=>[
        register
    ])

    const register = ( {on} ) =>
        on('input', {'input[type=range]':update})

    const update = event =>
        number.innerText = event.target.value
})
```

## Browsers support <sub><sup><sub><sub>made by <a href="https://godban.github.io">godban</a></sub></sub></sup></sub>

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE8, IE9, IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions


*IE8 and Legacy Browsers using `jails.legacy.js`.*

<br />

## License
[MIT](http://opensource.org/licenses/MIT)

