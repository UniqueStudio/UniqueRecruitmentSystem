import { Color, makeStyles } from '@material-ui/core';

import { getRainbow } from './index';

const colors = (i: keyof Color) => {
    const colorArray = getRainbow(i);
    const start = ~~(Math.random() * colorArray.length);
    return colorArray.slice(start).concat(colorArray.slice(0, start));
};

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    '@keyframes rainbow': {
        '0%': { backgroundPosition: '0% 80%' },
        '50%': { backgroundPosition: '100% 20%' },
        '100%': { backgroundPosition: '0% 80%' },
    },
    background: {
        height: '100vh',
        background: `linear-gradient(45deg, ${colors(200).join()})`,
        animation: '$rainbow 50s ease infinite',
        backgroundSize: '1800% 1800%',
    },
    container: {
        height: 400,
        [breakpoints.down('sm')]: {
            width: '80vw',
        },
        width: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        display: 'grid',
        gap: spacing(2),
        justifyItems: 'center',
    },
    qrCode: {
        width: '100%',
        maxWidth: spacing(30),
    },
    logoImage: {
        width: '10%',
        minWidth: 100,
        margin: spacing(1),
        userSelect: 'none',
    },
}));

export default useStyles;
