> Jails Components lives in their own world, does not know anything what's happening on views, controllers, apps and also doesn't know where he is or if there's other components in the page.

One of the most often architecture mistakes is related to not giving the right responsability for the components. It results in a large peace of code which does not will be reused at all.

Jails provides a limited way to construct a component. Whenever you create a new component and you see yourself in a situation where you need more methods such Jails component doesn't provide, then you'll know that what you're doing either is not a component, or you can split your tasks better in such a way that your component can achieve a job completely on it's own.

So, the only way your component can comunicate with your application is by emmiting an event. Then, other special class can be listening to it and go forward doing whatever you need to do.

## .emit
    .emit( action, [data] );

```js
jails.component('my-component', function(html){

    var cp = this;

    this.init = function(){
        html.find('a').on('click', shout);
    };

    function shout(){
        cp.emit('shout', { something:'lalalal'});
    }
});

```

Your higher class ( `app`, `view` or `controller`) should listen to your component event.

```js
jails.view('my-view', function(html, data){

    this.init = function(){
        this.listen('my-component:shout', log);
    };

    function log(ev, option){
        console.log('My component says' + option.something);
    }
});

```
