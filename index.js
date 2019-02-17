import jails          from './src/lib'
import register       from './src/register'
import reactor        from 'jails.packages/reactor'
import {pandora, log} from 'jails.packages/pandora'

pandora.middlewares = {log}

export default jails
    .use( register(pandora) )
    .extends( reactor() )

 
export const store = pandora