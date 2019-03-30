import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

import { colorToShadow } from './index';

const styles = ({ spacing: { unit }, palette, breakpoints, zIndex, transitions }: Theme) => createStyles({
    div: {
        overflow: 'auto',
        height: '100%'
    },
    columnContainer: {
        height: '100%',
        display: 'inline-flex',
        padding: `${unit * 3}px ${unit * 3}px 0`,
        [breakpoints.down('xs')]: {
            padding: `${unit * 3}px ${unit}px 0`,
        },
    },
    column: {
        margin: unit,
        padding: unit,
        color: 'rgba(0, 0, 0, 0.87)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    columnHeader: {
        background: palette.primary.light,
        borderRadius: 3,
        marginTop: -unit * 3,
        marginLeft: unit * 5,
        marginRight: unit * 5,
        marginBottom: unit,
        boxShadow: colorToShadow(palette.primary.light),
        userSelect: 'none',
    },
    columnTitle: {
        color: palette.secondary.contrastText,
        textAlign: 'center',
        margin: unit,
    },
    columnBody: {
        height: 'calc(100% - 40px)',
        marginBottom: unit,
        [breakpoints.down('xs')]: {
            width: 300,
        },
        width: 360,
        paddingTop: unit,
    },
    fab: {
        position: 'fixed',
        right: unit * 5,
        bottom: unit * 5,
        [breakpoints.down('xs')]: {
            right: unit * 2,
            bottom: unit * 2,
        },
        zIndex: zIndex.modal + 1,
    },
    fabMoveUp: {
        [breakpoints.down('sm')]: {
            transform: 'translateY(-46px)',
            transition: transitions.create(['transform'], {
                duration: transitions.duration.enteringScreen,
                easing: transitions.easing.easeOut,
            }),
        },
        [breakpoints.down('xs')]: {
            transform: 'translateY(-60px)',
        },
    },
    fabMoveDown: {
        [breakpoints.down('sm')]: {
            transform: 'translateY(0)',
            transition: transitions.create(['transform'], {
                duration: transitions.duration.leavingScreen,
                easing: transitions.easing.sharp,
            }),
        },
    },
    fabButtonsZoom: {
        position: 'fixed',
        right: unit * 15,
        bottom: unit * 8,
        [breakpoints.down('xs')]: {
            right: unit,
            bottom: unit * 9,
        },
        zIndex: zIndex.modal + 1,
    },
    fabButtonsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    fabButton: {
        margin: unit,
    },
    detailContent: {
        display: 'flex',
        [breakpoints.down('sm')]: {
            'margin': `${unit}px 0`,
            '& button': {
                width: 'auto',
                height: 'auto',
            },
        },
        overflowY: 'auto',
        margin: unit * 2,
    },
    detailMain: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        [breakpoints.up('lg')]: {
            flexDirection: 'row',
        },
    },
    leftButton: {
        transform: 'rotate(90deg)',
        alignSelf: 'center',
        padding: unit,
        [breakpoints.down('sm')]: {
            padding: 0
        },
    },
    rightButton: {
        transform: 'rotate(-90deg)',
        alignSelf: 'center',
        padding: unit,
        [breakpoints.down('sm')]: {
            padding: 0
        },
    },
});

export default styles;
