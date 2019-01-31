export const titleConverter = (title: string) => {
    try {
        const last = title.slice(4);
        const abbr = ['S', 'C', 'A'];
        const full = ['春招', '夏令营', '秋招'];
        const i = abbr.indexOf(last);
        if (i >= 0) {
            return title.slice(0, 4) + full[i];
        }
        const j = full.indexOf(last);
        if (j >= 0) {
            return title.slice(0, 4) + abbr[i];
        }
        return '';
    } catch (e) {
        return '';
    }
};
