import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

import { colorToAlpha } from './index';

const styles = ({ spacing: { unit }, transitions, breakpoints, palette, zIndex }: Theme) => createStyles({
    messenger: {
        display: 'flex',
        flexDirection: 'column',
        margin: unit,
        padding: unit,
        height: '80vh',
        [breakpoints.up('sm')]: {
            width: 400,
        },
        [breakpoints.down('xs')]: {
            height: '75vh',
        },
        flex: '1',
    },
    messages: {
        flex: '1',
        overflowY: 'auto',
        padding: unit,
        marginBottom: unit,
        transition: transitions.create(['padding'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen,
        }),
    },
    messageContainer: {
        display: 'flex',
        margin: `${unit}px 0`,
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
        padding: unit,
        whiteSpace: 'normal',
        background: colorToAlpha(palette.secondary.light, 0.3),
        '& > *': {
            whiteSpace: 'normal',
        },
    },
    myChip: {
        background: colorToAlpha(palette.primary.main, 0.8),
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
        marginTop: unit,
    },
    avatar: {
        margin: unit,
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
        marginLeft: 'auto'
    }
});

export default styles;
