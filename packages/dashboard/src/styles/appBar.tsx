import { makeStyles } from '@material-ui/core';

import { drawerWidth } from './index';

const useStyles = makeStyles(({ zIndex, palette, transitions, spacing, breakpoints }) => ({
    appBar: {
        zIndex: zIndex.drawer + 1,
        background: `linear-gradient(60deg, ${palette.primary.main}, ${palette.primary.dark})`,
        transition: transitions.create(['width', 'margin'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: transitions.create(['width', 'margin'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen,
        }),
    },
    appBarGutters: {
        paddingRight: 0,
    },
    menuButton: {
        marginLeft: spacing(2),
        marginRight: spacing(4),
        [breakpoints.down('xs')]: {
            marginLeft: 0,
            marginRight: 0,
            padding: spacing(1),
        },
    },
    rightButtons: {
        marginLeft: 'auto',
        display: 'flex',
        '& button': {
            [breakpoints.down('xs')]: {
                padding: spacing(1),
            },
        },
    },
    hide: {
        display: 'none',
    },
    suggestion: {
        padding: spacing(2),
        overflowY: 'auto',
    },
    collapse: {
        zIndex: zIndex.drawer + 1,
        position: 'fixed',
        top: spacing(8),
        [breakpoints.down('xs')]: {
            top: spacing(7),
        },
        right: 0,
    },
}));

export default useStyles;
