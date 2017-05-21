import { prompt } from 'inquirer';
import { List } from 'immutable';
import { get, set, questionItem } from './list';
import { Decision, fresh, discardPossibilityAndAbove, discardPossibilityAndBelow } from './decision';
import getMiddle from './utils/getMiddle';
import getCenterArray from './utils/getCenterArray';

function isDifferenceOneOrZero(x: number, y: number): boolean {
    const greater = x > y ? x : y;
    const lesser = x > y ? y : x;
    const diff = greater - lesser;
    return diff === 1 || diff === 0;
}

function updateList(list: List<string>, item: string, position: number): List<string> {
    return list.insert(position, item);
}

async function ask(name: string, decision: Decision | undefined) {

    const list = await get(name);

    if (!decision) {
        const ans = await prompt([{
            name: 'item',
            message: 'what should we insert?'
        }]);

        decision = fresh(ans.item, list.size);
    }

    console.log(decision);

    if (list.size === 0) {
        set(name, list.push(decision.item));
    }

    if (!Array.isArray(decision.positions)) {

        const ans = await prompt([{
            type: 'confirm',
            name: 'decision',
            message: `is ${decision.item} above ${list.get(decision.positions)}?`,
            default: false
        }]);

        const insertPosition = ans.decision ? decision.positions : decision.positions + 1;

        set(name, list.insert(insertPosition, decision.item));
    } else {

        let posUnderQuestion = getCenterArray(decision.positions);
        let itemUnderQuestion = questionItem(list, decision);

        const ans = await prompt([{
            type: 'confirm',
            name: 'decision',
            message: `is ${decision.item} above ${itemUnderQuestion}`,
            default: false
        }]);

        if (ans.decision) {
            ask(name, discardPossibilityAndBelow(decision, posUnderQuestion));
        } else {
            ask(name, discardPossibilityAndAbove(decision, posUnderQuestion));
        }
    }
}

async function main() {
    const ans = await prompt([{
        name: 'name',
        message: 'what list do you wish to add to?'
    }]);

    ask(ans.name, undefined);
}

main();