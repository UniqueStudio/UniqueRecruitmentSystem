const styleGenerator = (i: number, j: number, k: string) => `${i}px ${j}px hsl(${k}, 100%, 50%)`;
const textShadow = [...new Array(400)].map((i, j) => styleGenerator(
    ~~[(j % 200 * 1.2), 120 - (j % 200 * 1.2), 120 - (j % 200 * 1.2), (j % 200 * 1.2) - 240][~~(j / 50) % 4],
    j,
    (5.4 * j).toFixed(1)
)).join();

const logger = () => setTimeout(
    console.log.bind(
        console,
        '%cUnique Studio',
        `font-size: 100px;padding-bottom:60px;margin-bottom:10px;text-align:center;text-shadow:${textShadow};`,
        '\n欢迎加入联创团队web组！',
    ),
);

export { logger };
