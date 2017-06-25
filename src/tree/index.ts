import Asker from '../asker'
import { EventEmitter } from 'events'

export class Empty {
    toString() {
        return ''
    }
}

export type Tree<T> = TreeNode<T> | Empty

export class TreeNode<T> {
    left: Tree<T>
    element: T
    right: Tree<T>

    constructor(left: Tree<T>, element: T, right: Tree<T>) {
        this.left = left
        this.element = element
        this.right = right
    }

    toString() {
        return `
        ${this.right}${this.element}${this.left}`
    }
}

function raw<T>(left: Tree<T>, element: T, right: Tree<T>): TreeNode<T> {
    return new TreeNode(left, element, right)
}

export function empty(): Empty {
    return new Empty()
}

function isEmpty<T>(t: Tree<T>): t is Empty {
    return t instanceof Empty
}

export function insert<T>(ask: Asker<T>, e: T, t: Tree<T>): Promise<Tree<T>> {
    if (isEmpty(t)) {
        return Promise.resolve(raw(empty(), e, empty()))
    }

    return new Promise((resolve, reject) => {
        const treeNode: TreeNode<T> = t
        const ev = ask.lt(e, treeNode.element)

        ev.on('decision', async (lt: boolean) => {
            if (lt) {
                return resolve(
                    raw(
                        treeNode.left,
                        treeNode.element,
                        await insert(ask, e, treeNode.right),
                    ),
                )
            } else {
                return resolve(
                    raw(
                        await insert(ask, e, treeNode.left),
                        treeNode.element,
                        treeNode.right,
                    ),
                )
            }
        })
    })
}
