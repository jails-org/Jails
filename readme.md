<p align="center">
  <img src="./logo.svg" width="120" />
</p>

<h1 align="center">Jails</h1>

<h3 align="center">Elegant and Minimalistic<br /> Javascript Application Library</h3>

<div align="center">
  <table align="center" border="0">
    <tr><td align="center">🏝 Built for <br/><a href="https://www.patterns.dev/posts/islands-architecture/" target="_blank">Island Architecture</a></td</tr>
    <td align="center">ƛ Inspired by <br/><a href="https://guide.elm-lang.org/architecture/" target="_blank">Elm Architecture</a></td>
    <td align="center">🔗 Ready for <br/><a href="https://htmx.org/essays/hypermedia-driven-applications" target="_blank">hypermedia applications</a></td></tr>
  </table>
</div>

<div align="center">
    <img src="https://badge.fury.io/js/jails-js.svg?id=2" alt="NPM Jails Version" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
</div>

<br />
<br />
<br />

## ✍️ Abstract

The JavaScript ecosystem, including browsers and tools, has undergone significant evolution over the years. However, it's evident that many of the complexities introduced by frameworks today may not be essential for the majority of web applications. The prevailing trend in modern app development seems to prioritize expertise in frameworks over mastery of the language itself, often leading to a sense of being confined within the framework ecosystem.

Jails was designed to be:
- **Decoupled** - Backend-agnostic, our solution seamlessly integrates with any backend framework or programming language. It refrains from importing styles and ensures a clean demarcation by avoiding mixing HTML within the codebase.
- **Lightweight** - Lightweight, weighing in at just around 5kb when gzipped. It enhances your application's performance by progressively lightening the load, separating HTML from your JavaScript code. This practice results in smaller bundles and a more streamlined application.
- **Interoperable** - It seamlessly integrates and functions alongside any other vanilla UI or behavioral libraries. You no longer need to wait for a specific Jails Chart.js library to be available; simply integrate it into your application hassle-free.

<br clear="all" />
<br />

## 👩🏻‍💻 Usage

`index.html`
```html
....

<app-counter>
  <template>
    <h1>${count}</h1>
    <button data-add>Add</button>
    <button data-subtract>Subtract</button>
  </template>
</app-counter>

<!-- or alternate version ( Considering SSR on page load ) -->
<app-counter>
  <h1 html-inner="count">0</h1>
  <button data-add>Add</button>
  <button data-subtract>Subtract</button>
</app-counter>
```

<br />

`components/counter/index.ts`
```ts
export default function appCounter({ main, on, state }) {

  main( _ => {
    on('click', '[data-add]', add)
    on('click', '[data-subtract]', subtract)
  })

  const add = () => {
    state.set( s => s.count+= 1 )
  }

  const subtract = () => {
    state.set( s => s.count-= 1 )
  }
}

export const model = {
  count: 0
}
```

<br />

`main.ts` 
```ts
import jails from 'jails-js'
import * as appCounter from './components/counter'

// Register all your components
jails.register('app-counter', appCounter)

// Execute Jails
jails.start()
```

<br>
<br>

## 🎥 Best Scenarios to use
Jails is better suited for:
        
#### Server Side Rendered ( SSR )

- Wordpress
- Laravel
- Ruby on Rails
- Node Backend with a Template System:
  - Pug, Liquid, Nunjucks, Handlebars etc.

#### Static Site Generated ( SSG )

- Hugo
- Astro
- Jekill
- 11ty
  ...etc

... Any site you can add a script tag on it =). So if you already have a engine that renders your html, Jails can be a good way to create an elegant event driven system.

<br />
        
## 📚 Demos & Docs

- [Online Examples & Playground](https://stackblitz.com/@Javiani/collections/jails-organization)
- [Documentation](https://jails-org.github.io/#/)

<br />

## ✋ Discussions
Join to the forum and be part of the project by asking, answering or discuss some aspect of the project and be welcome to help in your way.

➡ [Discussions](https://github.com/jails-org/Jails/discussions)

<br />
        
## 🎖 License

[MIT](http://opensource.org/licenses/MIT)


<div align="center">
  
  <img src="https://github.com/jails-org/Jails/assets/567506/e9222352-312d-4b75-91a8-a23c32251b87" width="100" />
  <br />
  Release: <strong>Athena</strong>
</div>
