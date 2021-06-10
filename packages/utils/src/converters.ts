const map: Record<string, string> = {
    S: '春季招新',
    C: '夏令营招新',
    A: '秋季招新',
    春: 'S',
    夏: 'C',
    秋: 'A',
};

export const convertRecruitmentName = (title: string) => {
    const year = title.slice(0, 4);
    const suffix = map[title[4]];
    return suffix ? year + suffix : title;
};
