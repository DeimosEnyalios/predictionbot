export interface state {
    onGoing: boolean,
    predictions : Map<string, number>,
    winners : string[],
    doAnswer : boolean,
    answer : string,
    size : number
}