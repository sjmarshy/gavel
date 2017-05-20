import { prompt } from 'inquirer';
import { List } from 'immutable';

const list = List.of('one', 'two', 'three');

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

function freshDecision(item: string): Decision {
    return {
        item,
        next: [0, list.size - 1],
    };
}

function getMiddle(start: number, end: number): number {
    return Math.floor(start + end / 2);
}

function itemToAskAbout({ next: [start, end] }: Decision): string {
    return list.get(getMiddle(start, end));
}

function updateList(item: string, position: number): void {
    console.log(list.insert(position, item));
}

async function ask(decision: Decision) {
    const ans = await prompt([{
        type: 'confirm',
        name: 'decision',
        message: `is ${decision.item} above ${itemToAskAbout(decision)}`,
        default: false
    }]);

    const middle = getMiddle(decision.next[0], decision.next[1]);

    if (!middle || isDifferenceOneOrZero(decision.next[0], decision.next[1])) {
        const { item, next: [one, two] } = decision;
        const position = ans.decision ? one : two;
        return updateList(item, (list.size === position + 1 ? position + 1 : position));
    }

    if (ans.decision) {
        decision.next[1] = middle
    } else if (!ans.decision) {
        decision.next[0] = middle
    }

    console.log(decision);

    ask(decision);
}

ask(freshDecision('four'));

// we could get a Decision -> Prompt fn

/*
prompt([{
    type: 'confirm',
    name: 'toBeDelivered',
    message: 'Is this for delivery?',
    default: false
}])
    .then(as => {
        console.log(as);
    });

*/
