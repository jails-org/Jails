import Reactor from './src/reactor'
import * as Pubsub  from './src/pubsub'

const Main = () => {

    const modules = {}
    const reactor = Reactor( modules )

    return {

		Pubsub,

        register( name, module, injection ){
            modules[ name ] = { module, injection }
        },

        start(){
            reactor.scan()
            reactor.observe()
		},

		devStart(){
			reactor.mode = 'development'
			console.time('Jails')
			this.start()
			console.timeEnd('Jails')
		}
    }
}

export default Main()
