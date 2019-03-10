export default ( pandora ) => ( jails ) => {
    
    jails.register = (name, module, dependencies) => {
        
        jails(name, (component) => {

            const callback = component.reactor
            const { model, actions, view = (state) => state } = module
            const autostart = Object.keys(model || {}).length > 0
            
            component.module = module
            component.Msg = pandora({ 
                model, 
                actions, 
                autostart,
                callback : (state) => callback( view(state) )
            })

            module.default ? module.default(component) : module(component)

        }, dependencies)
    }
}
