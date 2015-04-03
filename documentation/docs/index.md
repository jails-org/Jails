# Architecture

## History

Jails has no relationship with Rails, but I really like Rails and the way it just simplified the way we develop a MVC applications.

Using the same philosophy, Jails tries to help developers to create a robust and organized architecture to your client side applications.

## The workflow

### Jails splits applications into 5 abstractions:

- App
- Component
- Model
- Controlller
- Modules

`App` and `Controller` shares a `data` variable which is readable and writable for these classes.

![Diagram](//jails-org.github.io/Jails/assets/images/diagram.png)

---

## Model

Model is not related to any of these classes, it should work on it's own shell, so, `model` is a regular AMD module.

## Apps & Controllers

Those 2 classes inherits from the same main class, and they have the same methods.

Controller is a particular case.
It can be extended with some view methods and strategies to deal with templates.

The idea is to handle the relationship of components using a Controller and the relationship of
controllers using the app.

## What about the **App** ?
App is a main controller, it wraps all the components, views, controllers and is used to start a property of `data` variable, or any other global action.

It's not possible to use view methods like controller does, app is just a mediator for your controllers and components.

## Component

Component exists in their own world, it doesn't have any relationship with other modules in the page.
Like a validation component for instance, or a datepicker, even a styled selectbox can be treated as a component.

The only job of component is to `emit` and `listen` events to their parents.

## Modules

A Module is just a AMD module, it doesn't have any relationship with **Jails** core,
but they can be used to extend your application, it will be probably the most independent element of jails core. That means you should be able to get this module and use in another project that doesn't have Jails running.
