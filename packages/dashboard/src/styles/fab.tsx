import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints, zIndex }) => ({
    fab: {
        position: 'fixed',
        right: spacing(5),
        bottom: spacing(5),
        [breakpoints.down('xs')]: {
            right: spacing(3),
            bottom: spacing(3),
        },
        zIndex: zIndex.modal + 1,
    },
}));

export default useStyles;
