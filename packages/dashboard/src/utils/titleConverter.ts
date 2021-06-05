const map: Record<string, string> = {
    S: '春季招新',
    C: '夏令营招新',
    A: '秋季招新',
    春季招新: 'S',
    夏令营招新: 'C',
    秋季招新: 'A',
    春招: 'S',
    夏令营: 'C',
    秋招: 'A',
};

export const titleConverter = (title: string) => {
    const suffix = map[title.slice(4)];
    return suffix ? title.slice(0, 4) + suffix : title;
};
