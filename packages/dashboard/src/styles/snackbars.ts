import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ zIndex, spacing, breakpoints }: Theme) => ({
    root: {
        zIndex: zIndex.snackbar,
        position: 'fixed',
        display: 'grid',
        gap: spacing(1),
        left: spacing(1),
        right: spacing(1),
        bottom: spacing(1),
        [breakpoints.up('sm')]: {
            left: spacing(3),
            right: 'auto',
            bottom: spacing(3),
        },
    },
}));

export default useStyles;
