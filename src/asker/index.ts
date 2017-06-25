import { prompt } from 'inquirer'
import { EventEmitter } from 'events'

export default class Asker<T> {
    getInsertionItem(): Promise<string> {
        return prompt([
            {
                message: 'What shall we insert?',
                name: 'item',
            },
        ]).then(x => x.item)
    }

    lt(l: T, r: T): EventEmitter {
        const e = new EventEmitter()
        prompt([
            {
                type: 'confirm',
                name: 'decision',
                message: `is ${l} above ${r}?`,
                default: false,
            },
        ]).then(x => {
            e.emit('decision', x.decision as boolean, l, r)
        })
        return e
    }
}
