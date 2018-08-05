import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";
import { colorToShadow } from './index';

const styles: StyleRulesCallback = (theme: Theme) => ({
    columnContainer: {
        display: "flex",
        width: 'fit-content',
    },
    column: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        borderRadius: 6,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: '100%'
    },
    columnHeader: {
        background: theme.palette.primary.light,
        borderRadius: 3,
        marginTop: -theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 5,
        marginRight: theme.spacing.unit * 5,
        marginBottom: theme.spacing.unit,
        boxShadow: colorToShadow(theme.palette.primary.light),
        userSelect: 'none'
    },
    columnTitle: {
        color: theme.palette.secondary.contrastText,
        textAlign: 'center',
        margin: theme.spacing.unit
    },
    columnBody: {
        height: 'calc(100% - 40px)',
        marginBottom: theme.spacing.unit,
        [theme.breakpoints.down("xs")]: {
            width: 300,
        },
        width: 360,
        paddingTop: theme.spacing.unit,
    },
    fab: {
        position: 'fixed',
        right: theme.spacing.unit * 5,
        bottom: theme.spacing.unit * 5,
        [theme.breakpoints.down('xs')]: {
            right: theme.spacing.unit * 2,
            bottom: theme.spacing.unit * 2,
        },
        zIndex: theme.zIndex.snackbar * 4,
    },
    fabButtonsContainer: {
        position: 'fixed',
        right: theme.spacing.unit * 15,
        bottom: theme.spacing.unit * 8,
        [theme.breakpoints.down('xs')]: {
            right: theme.spacing.unit,
            bottom: theme.spacing.unit * 9,
        },
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.snackbar * 4,
    },
    fabButton: {
        margin: theme.spacing.unit,
    },
    detailContent: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            margin: `${theme.spacing.unit}px 0`,
            '& button': {
                width: 'auto',
                height: 'auto'
            }
        },
        overflowY: 'auto',
        margin: theme.spacing.unit * 2,
    },
    detailMain: {
        display: 'flex',
        flexDirection: "column",
        [theme.breakpoints.up('lg')]: {
            flexDirection: "row",
        },
    },
    leftButton: {
        transform: 'rotate(90deg)',
        alignSelf: 'center'
    },
    rightButton: {
        transform: 'rotate(-90deg)',
        alignSelf: 'center'
    },
});

export default styles;