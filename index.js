import Reactor from './src/reactor'
import * as Pubsub  from './src/pubsub'

const Main = () => {

    const modules = {}

    return {

		Pubsub,

        register( name, module, injection ){
            modules[ name ] = { module, injection }
        },

        start(){
			const reactor = Reactor(modules)
            reactor.scan()
            reactor.observe()
		},

		devStart(){
			console.time('Jails')
			const reactor = Reactor( modules )
			reactor.mode = 'development'
			reactor.scan()
			reactor.observe()
			console.timeEnd('Jails')
		}
    }
}

export default Main()
