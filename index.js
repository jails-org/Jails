import jails    from './src/lib'
import register from './src/register'
import reactor  from './src/reactor'

export default jails
    .use( register() )
    .extends( reactor() )