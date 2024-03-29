import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ breakpoints }: Theme) => ({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '50%',
        minWidth: 300,
        userSelect: 'none',
    },
    table: {
        textAlign: 'center',
        borderCollapse: 'collapse',
        '& td': {
            border: 'solid 1px darkGrey',
        },
        '& tr': {
            height: '36px',
        },
        [breakpoints.down('md')]: {
            writingMode: 'vertical-lr',
        },
    },
    bold: {
        fontWeight: 1000,
        textStroke: '1px',
    },
    alignBottom: {
        verticalAlign: 'bottom',
    },
    large: {
        fontSize: 20,
        letterSpacing: 6,
    },
    extraLarge: {
        fontSize: 54,
        '& td': {
            padding: '8px 24px',
        },
    },
    bgWhite: {
        background: 'white',
    },
    bgRed: {
        background: 'red',
    },
    bgBlue: {
        background: 'blue',
    },
    fgWhite: {
        color: 'white',
    },
    fgRed: {
        color: 'red',
    },
    fgBlue: {
        color: 'blue',
    },
    fgBlack: {
        color: 'black',
    },
}));

export default useStyles;
