import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    tabPanel: {
        [breakpoints.down('sm')]: {
            padding: spacing(1),
        },
    },
}));

export default useStyles;
