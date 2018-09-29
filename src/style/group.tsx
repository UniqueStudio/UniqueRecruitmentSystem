import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    infoContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        },
        minWidth: 320
    },
    paper: {
        margin: theme.spacing.unit * 2,
        padding: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.up('md')]: {
            width: '45%',
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
    },
    button: {
        margin: theme.spacing.unit
    },
    table: {
        margin: theme.spacing.unit
    },
    tableCell: {
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing.unit,
            textAlign: 'center'
        }
    },
    title: {
        display: 'flex',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'space-around'
    },
    chooseContainer: {
        margin: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column'
    },
    choose: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline'
    },
    chip: {
        margin: theme.spacing.unit,
    },
    textField: {
        width: 100,
        margin: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            width: 70,
        },
        [theme.breakpoints.down('xs')]: {
            width: 50,
            margin: theme.spacing.unit / 2,
        }
    },
    notification: {
        margin: theme.spacing.unit
    },
    dialog: {
        margin: theme.spacing.unit * 2
    },
    smsDetail: {
        margin: theme.spacing.unit * 2,
    },
    placeInput: {
        marginTop: theme.spacing.unit
    },
    timeSelect: {
        marginRight: theme.spacing.unit
    }
});

export default styles;