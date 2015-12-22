# Jails ||\\|

## A Javascript AMD Framework

- [The Framework](#the-framework)
- [The Community is the Framework](#the-community-is-the-framework)
- [DRY - The solution on a Repository](#dry-the-solution-on-a-repository)
- [Refactory is Easy](#refactory-is-easy)
- [Dive in](#dive-in)
- [Browser Support](#browser-support)

## The Framework

We belive that MVC might not the best pattern for Javascript applications,
because it's very difficult to abstract html + javascript in such way that it totally makes sense.

Jails pretends to be an AMD framework and it's philosophy is to extend it by creating modules
and growing horizontally keeping all things decoupled and standalone and in the same way giving you
all the reusable power of modularity.

And... Low Learning Curve.

## The Community is the Framework

Since Jails is modular, you don't need to use the standard module to render views.
You can create your own mini view project and other devs can choose whether is better
depending on some situation or application.

Community should decide the future of the framework.

## DRY, The solution on a Repository

This AMD project keeps all reusable modules such as `controllers`, `apps`, `components` and other
powerful Jails's modules are already saved on a repository, you don't need to solve the same problem twice.

## Refactory is Easy

Everything is just a small part of the main problem. The modular philosophy helps you to
easily isolate your damaged module and repair it without dealing with spaghetti and unstructured code.

## Dive in

Are you interested? Do you want to know more about it?
Check out some examples, documentations, screencasts and more.

- [Documentation](//jails-org.github.io/Jails/)

## Browser Support

Jails supports all modern browsers plus IE 9 +.
It also supports IE8 if you use a polyfill for `Event Listeners`.

The most practical way to do that is by using some jQuery or any other library that handle events and custom events.
I recommend to use the [jQuery.Adapter](//github.com/jails-org/Modules/tree/master/jquery.adapter) module to augment support.
