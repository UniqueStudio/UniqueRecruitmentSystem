import { makeStyles } from '@material-ui/core';

import { drawerWidth } from './index';

const useStyles = makeStyles(({ transitions, mixins, spacing, breakpoints }) => ({
    drawerPaper: {
        position: 'sticky',
        top: 0,
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        width: drawerWidth,
        transition: transitions.create('width', {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: transitions.create('width', {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
        width: spacing(9),
        [breakpoints.down('sm')]: {
            border: 0,
            width: '1px', // bugs in 0px, iOS <- I think it is fixed now
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: `0 ${spacing(1)}`,
        ...mixins.toolbar,
    },
    icon: {
        margin: `0 ${spacing(1)}`,
    },
}));

export default useStyles;
