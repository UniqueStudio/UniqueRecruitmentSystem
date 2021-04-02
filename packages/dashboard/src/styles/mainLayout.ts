import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    root: {
        display: 'flex',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100vh',
        overflowX: 'auto',
        [breakpoints.down('sm')]: {
            minWidth: 'calc(100vw - 1px)',
        },
        padding: spacing(2),
        [breakpoints.down('xs')]: {
            padding: spacing(1),
        },
    },
}));

export default useStyles;
