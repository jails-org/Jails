export default ( pandora ) => ( jails ) => {
    
    jails.register = (name, module, dependencies) => {
        
        jails(name, (component) => {

            const callback = component.reactor
            const { model, actions } = module
            
            component.module = module
            component.Msg = pandora({ model, actions, callback })

            module.default ? module.default(component) : module(component)

        }, dependencies)
    }
}
