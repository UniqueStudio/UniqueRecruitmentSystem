import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

import { colorToShadow } from './index';

const styles = ({ spacing: { unit }, palette, breakpoints, zIndex, transitions }: Theme) => createStyles({
    columnContainer: {
        display: 'flex',
        width: 'fit-content',
        padding: `0 ${unit * 3}px`,
        [breakpoints.down('xs')]: {
            padding: `0 ${unit}px`,
        },
    },
    column: {
        margin: unit,
        padding: unit,
        borderRadius: 6,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
        zIndex: zIndex.snackbar * 4,
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
        zIndex: zIndex.snackbar * 4,
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
        [breakpoints.up('lg')]: {
            flexDirection: 'row',
        },
    },
    leftButton: {
        transform: 'rotate(90deg)',
        alignSelf: 'center',
    },
    rightButton: {
        transform: 'rotate(-90deg)',
        alignSelf: 'center',
    },
});

export default styles;
