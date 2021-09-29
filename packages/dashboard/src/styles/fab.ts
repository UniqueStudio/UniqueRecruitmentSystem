import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

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
