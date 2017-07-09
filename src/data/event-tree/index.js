import Union from 'tagged-union'

const Tree = new Union(['Node', 'Empty'])

export function raw(left, value, right) {
    return Tree.Node(left, value, right)
}

export function empty() {
    return Tree.Empty()
}

export function isEmpty(tree) {
    return tree.match({
        Empty() {
            return true
        },
        Node() {
            return false
        },
    })
}

export function insert(getInput, tree, value) {
    return new Promise(resolve => {
        tree.match({
            Empty() {
                resolve(raw(empty(), value, empty()))
            },
            Node(left, nodeValue, right) {
                getInput
                    .lt(value, nodeValue)
                    .on('decision', async ({ detail: lessThan }) => {
                        console.log(lessThan)
                        if (lessThan) {
                            return resolve(
                                raw(
                                    await insert(getInput, left, value),
                                    nodeValue,
                                    right,
                                ),
                            )
                        }
                        return resolve(
                            raw(
                                left,
                                nodeValue,
                                await insert(getInput, right, value),
                            ),
                        )
                    })
            },
        })
    })
}
