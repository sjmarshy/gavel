export default function concat<T, U>(xs: Array<T>, i: T | U): Array<T | U> {
    return [...xs, i];
}