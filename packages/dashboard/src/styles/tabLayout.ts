import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => ({
    tabPanel: {
        [breakpoints.down('sm')]: {
            padding: spacing(1),
        },
    },
}));

export default useStyles;
