import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

import { colorToShadow } from './index';

const styles = ({ spacing, palette, breakpoints, zIndex, transitions }: Theme) => createStyles({
    div: {
        overflow: 'auto',
        height: '100%'
    },
    columnContainer: {
        height: '100%',
        display: 'inline-flex',
        padding: `${spacing(3)}px ${spacing(3)}px 0`,
        [breakpoints.down('xs')]: {
            padding: `${spacing(3)}px ${spacing(1)}px 0`,
        },
    },
    column: {
        margin: spacing(1),
        padding: spacing(1),
        color: 'rgba(0, 0, 0, 0.87)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    columnHeader: {
        background: palette.primary.light,
        borderRadius: 3,
        marginTop: -spacing(3),
        marginLeft: spacing(5),
        marginRight: spacing(5),
        marginBottom: spacing(1),
        boxShadow: colorToShadow(palette.primary.light),
        userSelect: 'none',
    },
    columnTitle: {
        color: palette.secondary.contrastText,
        textAlign: 'center',
        margin: spacing(1),
    },
    columnBody: {
        height: 'calc(100% - 40px)',
        marginBottom: spacing(1),
        [breakpoints.down('xs')]: {
            width: 300,
        },
        width: 360,
        paddingTop: spacing(1),
    },
    fab: {
        position: 'fixed',
        right: spacing(5),
        bottom: spacing(5),
        [breakpoints.down('xs')]: {
            right: spacing(2),
            bottom: spacing(2),
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
        right: spacing(15),
        bottom: spacing(8),
        [breakpoints.down('xs')]: {
            right: spacing(1),
            bottom: spacing(9),
        },
        zIndex: zIndex.modal + 1,
    },
    fabButtonsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    fabButton: {
        margin: spacing(1),
    },
    detailContent: {
        display: 'flex',
        [breakpoints.down('sm')]: {
            'margin': `${spacing(1)}px 0`,
            '& button': {
                width: 'auto',
                height: 'auto',
            },
        },
        overflowY: 'auto',
        margin: spacing(2),
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
        padding: spacing(1),
        [breakpoints.down('sm')]: {
            padding: 0
        },
    },
    rightButton: {
        transform: 'rotate(-90deg)',
        alignSelf: 'center',
        padding: spacing(1),
        [breakpoints.down('sm')]: {
            padding: 0
        },
    },
});

export default styles;
