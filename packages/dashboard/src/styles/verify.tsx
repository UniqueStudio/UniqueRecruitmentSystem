import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    content: {
        minHeight: spacing(3),
        maxWidth: 700,
        display: 'flex',
        alignItems: 'baseline',
    },
    item: {
        [breakpoints.down('xs')]: {
            margin: spacing(0.5),
        },
        margin: spacing(1),
    },
    input: {
        [breakpoints.down('xs')]: {
            width: 100,
        },
        width: 150,
    },
}));

export default useStyles;
