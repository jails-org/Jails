# Canonical Examples

## Register and Start

```ts
import { register, start } from 'jails-js'
import * as helloWorld from './components/hello-world'

register('hello-world', helloWorld)
start()
```

## Counter Markup

```html
<hello-world>
  <h1>Hello World!</h1>
  <p>A simple Counter</p>
  <button class="btn add">+</button>
  <span html-inner="counter">0</span>
  <button class="btn subtract">-</button>
</hello-world>
```

## Counter Component

```ts
export default function helloWorld({ main, on, state }) {
  main(() => {
    on('click', 'button.add', add)
    on('click', 'button.subtract', subtract)
  })

  const add = () => {
    state.set(s => {
      s.counter += 1
    })
  }

  const subtract = () => {
    state.set(s => {
      s.counter -= 1
    })
  }
}

export const model = {
  counter: 0
}
```

## Conditional Rendering

```html
<my-component>
  <div html-if="show">Hello, {{ name }}</div>
  <div html-if="!show">I'm hidden!</div>
</my-component>
```

```ts
state.set({ name: 'Clark Kent', show: true })
```

## Loop Rendering

```html
<my-component>
  <ul>
    <li html-for="item in list">
      <span html-if="item.show">{{ item.name }} {{ $index }}</span>
    </li>
  </ul>
</my-component>
```

## Attribute Binding

```html
<my-component html-class="loading ? 'is-loading' : ''">
  <img html-src="imageUrl" alt="">
</my-component>
```

## Static Third-Party Region

```html
<app-swiper>
  <input type="number" value="1" min="1" max="9" html-static>
  <p>Chosen page: {{ page }}</p>
  <div class="swiper mySwiper" html-static>
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
    </div>
  </div>
</app-swiper>
```

```ts
import Swiper from 'swiper'

export default function appSwiper({ main, on, elm, state }) {
  const wrapper = elm.querySelector('.swiper')
  const swiper = new Swiper(wrapper)

  main(() => {
    on('input', 'input[type=number]', goTo)
  })

  const goTo = e => {
    const page = Number(e.target.value) || 1
    swiper.slideTo(page - 1)
    state.set({ page })
  }
}

export const model = {
  page: 1
}
```

## Dependency Injection

```ts
import { register } from 'jails-js'
import http from './shared/http'
import * as myComponent from './components/my-component'

register('my-component', myComponent, { http })
```

```ts
export default function myComponent({ main, dependencies }) {
  const { http } = dependencies

  main(() => {
    // use http
  })
}
```

## View Function

```ts
export const view = state => ({
  ...state,
  biggerThen10: state.counter > 10 ? 'bigger' : ''
})
```

```html
<div html-class="biggerThen10">{{ counter }}</div>
```

## Embedded Template

```ts
import { html, attributes } from 'jails-js/html'

export const template = ({ children }) => html`
  ${children}
  <div>{{ counter }}</div>
  <button data-add ${attributes({ id: 'my-button-id' })}>+</button>
`
```

## Global Pub/Sub

```ts
export default function producer({ main, on, publish }) {
  main(() => {
    on('click', 'button', doSomething)
  })

  const doSomething = () => {
    fetch('/service')
      .then(response => response.json())
      .then(data => publish('my-component:fetched', data))
  }
}
```

```ts
export default function consumer({ main, subscribe, unmount }) {
  let unsubscribe

  main(() => {
    unsubscribe = subscribe('my-component:fetched', data => {
      console.log(data)
    })
  })

  unmount(() => {
    if (unsubscribe) unsubscribe()
  })
}
```

