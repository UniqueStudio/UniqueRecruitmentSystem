import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    template: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing.unit
        },
        margin: theme.spacing.unit * 2,
        overflowY: 'auto'
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
    templateColumn: {
        flexDirection: 'column'
    },
    templateEnd: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    formGroup: {
        flexDirection: 'row'
    },
    dateSelect: {
        display: 'flex',
        alignItems: 'center'
    }
});

export default styles;