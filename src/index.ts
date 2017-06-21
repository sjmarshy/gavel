import Asker from './asker'
import { insert, empty } from './tree'

const ask = new Asker()

const inspect = <T>(x: T): T => {
    console.log(`${x}`)
    return x
}

insert(ask, 'test', empty())
    .then(inspect)
    .then(t => insert(ask, 'higher', t))
    .then(inspect)
    .then(t => insert(ask, 'lower', t))
    .then(inspect)
