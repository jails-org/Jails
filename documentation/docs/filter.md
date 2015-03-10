> Filters are just filters... It's used on strings using mustache templates.
It doesn't have any methods from Jails internal classes.

```js
jails.filter('uppercase', function( string ){
    return string.toUpperCase();
});
```

After defined a filter, you can use it on any mustache template.

```html
{{#user}}
    My user name is :{{#uppercase}}{{user}}{{/uppercase}}
{{/user}}

```
