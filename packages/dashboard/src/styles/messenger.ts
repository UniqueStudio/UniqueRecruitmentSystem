import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing, transitions, breakpoints, palette, zIndex }: Theme) => ({
    collapse: {
        zIndex: zIndex.drawer + 1,
        position: 'fixed',
        top: spacing(8),
        [breakpoints.down('sm')]: {
            top: spacing(7),
        },
        right: 0,
    },
    messenger: {
        display: 'flex',
        flexDirection: 'column',
        margin: spacing(1),
        padding: spacing(1),
        height: 'calc(100vh - 96px)',
        [breakpoints.up('sm')]: {
            width: 400,
        },
        [breakpoints.down('sm')]: {
            height: '75vh',
        },
        flex: '1',
    },
    messages: {
        flex: '1',
        overflowY: 'auto',
        padding: spacing(1),
        marginBottom: spacing(1),
        transition: transitions.create(['padding'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen,
        }),
    },
    messageContainer: {
        display: 'flex',
        margin: spacing(1, 0),
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
        height: 'auto',
        padding: spacing(1),
        whiteSpace: 'normal',
        background: palette.secondary.light,
        '& > *': {
            whiteSpace: 'normal',
        },
    },
    myChip: {
        background: palette.primary.light,
        color: palette.primary.contrastText,
    },
    myDivider: {
        background: 'white',
    },
    messageContent: {
        wordWrap: 'break-word',
        maxWidth: 200,
        userSelect: 'text',
        cursor: 'text',
        marginTop: spacing(1),
    },
    avatar: {
        margin: spacing(1),
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
        maxWidth: '100%',
    },
    imageRoot: {
        zIndex: zIndex.snackbar * 4,
    },
    closeButton: {
        marginLeft: 'auto',
    },
}));

export default useStyles;
