# Getting started

## Old fashion way

1. Just download [jails.min](https://github.com/Javiani/Jails/blob/master/source/jails.min.js).
2. Create `config.js` file

You'll need to follow framework folder structure in order to make jails work and make a sense.
You may take a look on:

- [Sample example](https://github.com/Javiani/Jails/tree/master/sample)
- [Todo MVC example](https://github.com/Javiani/Jails/tree/master/todomvc)

## Gulp way ( Better )

If you want to "compile" your code you can use `gulp-jails` and take advantage of scaffolding and building tasks.

- Point `gulp-jails` in your `package.json`.

```js
"devDependencies": {
    "gulp-jails" :"git://github.com/jails-org/Gulp"
}
```

- Install it, `npm install`
- Execute **gulp-jails** from your `gulpfile.js`

```js
require('gulp-jails')();
```

More information about cli operations and tasks, visit [Gulp Jails](https://github.com/jails-org/Gulp-Jails).
