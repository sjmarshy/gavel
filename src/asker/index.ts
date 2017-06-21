import { prompt } from 'inquirer'

export default class Asker<T> {
    lt(l: T, r: T): Promise<boolean> {
        return prompt([
            {
                type: 'confirm',
                name: 'decision',
                message: `is ${l} above ${r}?`,
                default: false,
            },
        ]).then(x => x.decision as boolean)
    }
}
