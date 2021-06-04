import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100vh',
        overflowX: 'auto',
        [breakpoints.down('md')]: {
            minWidth: 'calc(100vw - 1px)',
        },
        padding: spacing(2),
        [breakpoints.down('sm')]: {
            padding: spacing(1),
        },
    },
}));

export default useStyles;
