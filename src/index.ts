import Asker from './asker'
import { insert, empty } from './tree'
import inspect from './utils/inspect'

const ask = new Asker()

let list = empty()
async function main() {
    const item = await ask.getInsertionItem()

    list = await insert(ask, item, list).then(inspect)

    // loop de loop
    await main()
}

main().catch(e => console.error(e) && process.exit(1))
