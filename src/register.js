import { pandora } from 'jails.packages/pandora'

export default () => (jails) => {
    
    jails.register = (name, module, dependencies) => {
        
        jails(name, (component) => {

            const callback = component.reactor
            const { model, actions } = module

            component.Msg = pandora({ model, actions, callback })
            module.default ? module.default(component) : module(component)

        }, dependencies)
    }
}
