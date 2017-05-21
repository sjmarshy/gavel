import { prompt } from 'inquirer';
import { List } from 'immutable';
import { get, set } from './list';

interface Decision {
    item: string;
    next: Array<number>;
}

function isDifferenceOneOrZero(x: number, y: number): boolean {
    const greater = x > y ? x : y;
    const lesser = x > y ? y : x;
    const diff = greater - lesser;
    return diff === 1 || diff === 0;
}

function freshDecision(item: string, list: List<string>): Decision {
    return {
        item,
        next: [0, list.size - 1],
    };
}

function getMiddle(start: number, end: number): number {
    return Math.floor(start + end / 2);
}

function itemToAskAbout(list: List<string>, { next: [start, end] }: Decision): string {
    return list.get(getMiddle(start, end));
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

        decision = freshDecision(ans.item, list);
    }

    if (list.size === 0) {
        set(name, list.push(decision.item));
    }

    const ans = await prompt([{
        type: 'confirm',
        name: 'decision',
        message: `is ${decision.item} above ${itemToAskAbout(list, decision)}`,
        default: false
    }]);

    const middle = getMiddle(decision.next[0], decision.next[1]);

    if (!middle || isDifferenceOneOrZero(decision.next[0], decision.next[1])) {
        const { item, next: [one, two] } = decision;
        const position = ans.decision ? one : two;
        set(name, updateList(list, item, (list.size === position + 1 ? position + 1 : position)));
        return;
    }

    if (ans.decision) {
        decision.next[1] = decision.next[1] === middle ? middle - 1 : middle;
    } else if (!ans.decision) {
        decision.next[0] = decision.next[0] === middle ? middle + 1 : middle;
    }

    console.log(decision);

    ask(name, decision);
}

async function main() {
    const ans = await prompt([{
        name: 'name',
        message: 'what list do you wish to add to?'
    }]);

    ask(ans.name, undefined);
}

main();