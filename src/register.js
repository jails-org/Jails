export default ( pandora ) => ( jails ) => {
    
    jails.register = (name, module, dependencies) => {
        
        jails(name, (component) => {

            const { model, actions, view = (state) => state } = module
            const hasinitialstate = component.elm.getAttribute('data-initialstate')
            const newmodel = hasinitialstate? Object.assign(model || {}, JSON.parse(hasinitialstate)) :model
            const autostart = Object.keys(newmodel || {}).length > 0
            
            component.module = module

            component.Msg = pandora({ 
                model: newmodel, 
                actions, 
                autostart,
                callback: (state) => {
                    state.parent = component.reactor.SST
                    component.reactor( view(state) )
                }
            })

            module.default ? module.default(component) : module(component)

        }, dependencies)
    }
}
