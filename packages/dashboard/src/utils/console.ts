const textShadow = [...new Array<unknown>(400)]
    .map((_, i) => i % 200 * 1.2)
    .map((i, j) => `${[i, 120 - i, 120 - i, i - 240][~~(j / 50) % 4]}px ${j}px hsl(${5.4 * j}, 100%, 50%)`)
    .join();

export const logger = () =>
    setTimeout(
        console.log.bind(
            console,
            '%cUnique Studio',
            `font-size: 100px;padding: 0 60px 60px;text-shadow:${textShadow};`,
            '\nProject URL: https://github.com/UniqueStudio/UniqueRecruitmentSystem',
        ),
    );
