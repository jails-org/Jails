import Component from './component'

export default ( node, reactor ) => {

	node.__instances__ = {}

    return {

        create({ name, module }){

            node.__instances__[name] = { methods: {} }
            const base = Component(reactor, module)(name, node)

            node.__instances__[name].base = base

            node.__update__ = (state) => {
                for( let name in node.__instances__ )
                    node.__instances__[name].base.update( state )
            }

            module.module.default( base )
            base.__initialize( base )

            delete base.__initialize
        }
    }
}
