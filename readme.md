<p align="center">
  <img  src="./logo.svg" width="120" />
</p>

<h1 align="center">Jails</h1>

<h3 align="center"><em>Elegant and Minimalistic Javascript Application Library</em></h3>
<div align="center">
  <a href="https://jails-org.github.io/">Documentation</a>&nbsp; | &nbsp;
  Built for <a href="https://www.patterns.dev/posts/islands-architecture/" target="_blank">Island Architecture 🏝</a>&nbsp; | &nbsp;
  Inspired by <a href="https://guide.elm-lang.org/architecture/" target="_blank">Elm Architecture</a> ƛ
</div>

<p align="center">
  
</p>

<div align="center">
    <img src="https://github.com/jails-org/Jails/assets/567506/a2feaae9-ab6c-4cd3-a891-aced2c901b78" width="100" />
    <br clear="all" />
    <img src="https://badge.fury.io/js/jails-js.svg?v5.1" alt="NPM Jails Version" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
</div>



<br />
<br />
<br />

## ✍️ Abstract

The Javascript ecossystem, browsers and tooling has evolved through these years and we believe that most of the complexities that frameworks bring to us today are not necessary for most of the Web Applications we have today. The current state of modern apps are forcing the Javascript Developer to be an expert on frameworks instead of the language and locking us in the framework ecossystem.

Jails was designed to be:
- **Decoupled** - Back-end agnostic, can be used with any back-end framework or language, does not import styles and does not mix html in the code.
- **Lightweight** - It's a very lightweight library (~5kb gzipped) and it makes your application progressively lite by keeping html away from your javascript code and therefore smaller bundles.
- **Interoperable** - It can be integrated and work with any other vanilla ui or behavioral libraries, so you don't have to wait for a Jails chartjs library in order to use, just integrate it in your app without pain.

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
export default function appCounter({ main, on, state ) {

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
