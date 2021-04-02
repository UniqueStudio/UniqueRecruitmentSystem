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
    container: {
        height: '100vh',
        background: `linear-gradient(45deg, ${colors(200).join()})`,
        animation: 'rainbow 50s ease infinite',
        backgroundSize: '1800% 1800%',
    },
    login: {
        height: 400,
        [breakpoints.down('xs')]: {
            width: 300,
        },
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrCode: {
        width: 200,
    },
    textField: {
        width: '65%',
    },
    logoImage: {
        width: '10%',
        minWidth: 100,
        height: 'auto',
        margin: spacing(1),
        userSelect: 'none',
    },
    button: {
        marginTop: spacing(1),
    },
}));

export default useStyles;
