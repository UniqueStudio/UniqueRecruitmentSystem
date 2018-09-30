import { Theme } from '@material-ui/core/styles';
import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

import { colorToAlpha } from './index';

const styles: StyleRulesCallback = (theme: Theme) => ({
    container: {
        display: 'flex',
        minHeight: '100%',
    },
    messenger: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.unit,
        height: 'calc(100vh - 112px)',
        transition: theme.transitions.create(['height', 'width', 'background'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        zIndex: 5000,
        position: 'sticky',
        top: 0,
        [theme.breakpoints.down('md')]: {
            position: 'fixed',
            minWidth: 400,
            right: theme.spacing.unit * 3,
            top: theme.spacing.unit * 11,
        },
        [theme.breakpoints.down('sm')]: {
            background: colorToAlpha('#ffffff', 0.5),
            minWidth: 'auto',
            right: 'auto',
            left: 0,
            top: theme.spacing.unit * 8,

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
        [theme.breakpoints.down('md')]: {
            overflowX: 'hidden',
            position: 'fixed',
            background: colorToAlpha('#ffffff', 0.5),
            minWidth: 400,
        },
        [theme.breakpoints.down('sm')]: {
            background: colorToAlpha('#ffffff', 0),
            boxShadow: 'none',
            minWidth: 64,
            width: 64,
        },
        transition: theme.transitions.create(['height', 'width', 'background'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowY: 'hidden',
    },
    messages: {
        flex: '1',
        overflowY: 'auto',
        padding: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        transition: theme.transitions.create(['padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    minimizeMessages: {
        padding: 0,
        transition: theme.transitions.create(['padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    messageContainer: {
        display: 'flex',
        margin: `${theme.spacing.unit}px 0`,
    },
    input: {
        marginTop: 'auto',
    },
    inputContent: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    textField: {
        width: '100%',
    },
    chipRoot: {
        'height': 'auto',
        'padding': theme.spacing.unit,
        'whiteSpace': 'normal',
        'background': colorToAlpha(theme.palette.secondary.light, 0.3),
        '& > *': {
            whiteSpace: 'normal',
        },
    },
    myChip: {
        background: colorToAlpha(theme.palette.primary.main, 0.8),
        color: theme.palette.primary.contrastText,
    },
    myDivider: {
        background: 'white',
    },
    messageContent: {
        wordWrap: 'break-word',
        maxWidth: 200,
        userSelect: 'text',
        cursor: 'text',
        marginTop: theme.spacing.unit,
    },
    avatar: {
        margin: theme.spacing.unit,
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
        display: 'none',
    },
    imageLayer: {
        maxHeight: '100%',
    },
    image: {
        '&:hover': {
            cursor: 'pointer',
        },
        'maxWidth': '100%',
    },
    imageRoot: {
        zIndex: theme.zIndex.snackbar * 4,
    },
    tooltip: {
        zIndex: theme.zIndex.snackbar * 4,
    },
});

export default styles;
