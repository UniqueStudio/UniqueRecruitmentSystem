import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => ({
    tabPanel: {
        [breakpoints.down('sm')]: {
            padding: spacing(1),
        },
    },
}));

export default useStyles;
