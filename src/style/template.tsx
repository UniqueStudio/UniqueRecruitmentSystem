import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    template: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing.unit
        },
        margin: theme.spacing.unit * 2,
    },
    stepper: {
        [theme.breakpoints.down("xs")]: {
            padding: 0,
        },
    },
    templateContent: {
        minHeight: theme.spacing.unit * 3,
    },
    templateParams: {
        display: 'flex',
    },
    templateItem: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing.unit / 2,
        },
        margin: theme.spacing.unit,
    },
    templateEnd: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default styles;