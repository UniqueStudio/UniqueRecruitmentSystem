import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    tabPanel: {
        [breakpoints.down('xs')]: {
            padding: spacing(1),
        },
    },
}));

export default useStyles;
