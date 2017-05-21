import concat from '../concat';
import getMiddle from '../getMiddle';

export default function getCenterArray<T>(xs: Array<T>): T {
    const xsm: Array<T | undefined> = xs.length % 2 === 0 ? concat<T, undefined>(xs, undefined) : xs;
    const item = xsm[getMiddle(1, xsm.length) - 1];

    if (item === undefined) {
        return xs[getMiddle(1, xs.length) - 1];
    }

    return item;
}