import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { drawerWidth } from './index';

const useStyles = makeStyles(({ zIndex, transitions, spacing, breakpoints }: Theme) => ({
    appBar: {
        zIndex: zIndex.drawer + 1,
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
        [breakpoints.down('sm')]: {
            marginLeft: 0,
            marginRight: 0,
            padding: spacing(1),
        },
    },
    rightButtons: {
        marginLeft: 'auto',
        display: 'flex',
        '& button': {
            [breakpoints.down('sm')]: {
                padding: spacing(1),
            },
        },
    },
    hide: {
        display: 'none',
    },
}));

export default useStyles;
