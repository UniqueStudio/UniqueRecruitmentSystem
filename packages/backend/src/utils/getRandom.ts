export const getRandom = (min: number, max: number) =>
    // '~~' (double NOT bitwise) operator is faster than Math.floor() in JavaScript
    ~~(Math.random() * (max - min) + min);
