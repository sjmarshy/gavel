import { range } from 'ramda';

export interface Decision {
    item: string; // the item to make a decision about
    positions: Array<number> | number; // the remaining possible positions for the decision to fit into
}

function raw(item: string, positions: Array<number> | number): Decision {
    if (Array.isArray(positions) && positions.length === 1) {
        positions = positions[0];
    }

    return {
        item,
        positions
    };
}

export function fresh(item: string, listSize: number): Decision {
    return raw(item, range(0, listSize + 1));
}

export function discardPossibilityAndAbove(decision: Decision, pos: number): Decision {
    const { item, positions } = decision;

    if (!Array.isArray(positions)) {
        return decision;
    } else {
        const newPositions = positions.sort().filter(p => p < pos);
        return raw(item, newPositions);
    }
}

export function discardPossibilityAndBelow(decision: Decision, pos: number): Decision {
    const { item, positions } = decision;
    if (!Array.isArray(positions)) {
        return decision;
    } else {
        const newPositions = positions.sort().filter(p => p < pos);
        return raw(item, newPositions);
    }

}