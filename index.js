import jails    from './src/lib'
import register from './src/register'
import reactor  from 'jails.packages/reactor'

export default jails
    .use( register() )
    .extends( reactor() )