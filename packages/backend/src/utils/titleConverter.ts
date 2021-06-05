export const titleConverter = (title: string) => {
    const last = title.slice(4);
    const abbr = ['S', 'C', 'A', 'O'];
    const full = ['春季招新', '夏令营招新', '秋季招新', '日常招新'];
    const i = abbr.indexOf(last);
    if (i >= 0) {
        return title.slice(0, 4) + full[i];
    }
    const j = full.indexOf(last);
    if (j >= 0) {
        return title.slice(0, 4) + abbr[i];
    }
    throw new Error('parameter is not a valid title');
};
