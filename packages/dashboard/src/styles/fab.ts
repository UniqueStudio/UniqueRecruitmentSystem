import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, breakpoints, zIndex }: Theme) => ({
    fab: {
        position: 'fixed',
        right: spacing(5),
        bottom: spacing(5),
        [breakpoints.down('sm')]: {
            right: spacing(3),
            bottom: spacing(3),
        },
        zIndex: zIndex.modal + 1,
    },
}));

export default useStyles;
