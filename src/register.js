export default ( pandora ) => ( jails ) => {
    
    jails.register = (name, module, dependencies) => {
        
        jails(name, (component) => {

            const callback = component.reactor
            const { model, actions } = module
            const autostart = Object.keys(model || {}).length > 0
            
            component.module = module
            component.Msg = pandora({ model, actions, callback, autostart })

            module.default ? module.default(component) : module(component)

        }, dependencies)
    }
}
