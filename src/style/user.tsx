import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    container: {
        width: '100%',
        minWidth: 320,
        maxWidth: 640,
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing.unit
        },
        padding: theme.spacing.unit * 2,
    },
    userInfo: {
        padding: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            width: '50%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        },
        width: 200
    }
});

export default styles;
