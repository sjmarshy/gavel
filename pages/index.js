import React from 'react'
import { empty, insert } from '../src/data/event-tree'
import eventEmitter from 'isomorphic-events'

const waitp = ms => new Promise(res => setTimeout(res, ms))

const getInput = {
    lt: (left, right) => {
        waitp(1000).then(() => {
            eventEmitter.emit('decision', { detail: left < right })
        })
        return eventEmitter
    },
}

const insertp = n => tree => insert(getInput, tree, n)

const inspect = x => {
    console.log(`${x}`)
    return x
}

insert(getInput, empty(), 1).then(insertp(8)).then(inspect)

export default () => <div>Hello, world</div>
