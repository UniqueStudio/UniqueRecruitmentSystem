import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";
import { colorToAlpha } from './index';

const styles: StyleRulesCallback = (theme: Theme) => ({
    container: {
        display: 'flex',
        minHeight: '100%'
    },
    messenger: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.unit,
        height: 'calc(100vh - 112px)',
        transition: theme.transitions.create("height", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        position: 'sticky',
        top: 0,
        [theme.breakpoints.down('md')]: {
            position: 'fixed',
            top: 'auto',
            bottom: 0,
            right: 0,
            zIndex: 5000,
            width: 400,
        },
        [theme.breakpoints.down('xs')]: {
            left: 0,
            width: '100%',
            height: '70%',
        },
    },
    minimize: {
        height: 64,
        transition: theme.transitions.create("height", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        overflowY: 'hidden'
    },
    messages: {
        flex: '1',
        overflowY: 'auto',
        padding: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    messageContainer: {
        display: 'flex',
        margin: `${theme.spacing.unit}px 0`
    },
    input: {
        marginTop: 'auto'
    },
    inputContent: {
        display: 'flex',
        alignItems: 'flex-end'
    },
    textField: {
        width: '100%'
    },
    chipRoot: {
        height: 'auto',
        padding: theme.spacing.unit,
        whiteSpace: 'normal',
        background: colorToAlpha(theme.palette.secondary.light, 0.3),
        '& > *': {
            whiteSpace: 'normal'
        }
    },
    myChip: {
        background: colorToAlpha(theme.palette.primary.main, 0.8),
        color: theme.palette.primary.contrastText
    },
    myDivider: {
        background: 'white'
    },
    messageContent: {
        wordWrap: 'break-word',
        maxWidth: 200,
        userSelect: 'text',
        marginTop: theme.spacing.unit
    },
    avatar: {
        margin: theme.spacing.unit
    },
    my: {
        flexDirection: 'row-reverse',
    },
    rightAlign: {
        marginLeft: 'auto',
    },
    message: {
        display: 'flex',
        flexDirection: 'column',
    },
    hidden: {
        display: 'none'
    },
    imageLayer: {
        maxHeight: '100%',
    },
    image: {
        '&:hover': {
            cursor: 'pointer',
        },
        maxWidth: '100%',
    },
    imageRoot: {
        zIndex: theme.zIndex.snackbar * 4
    }
});

export default styles;