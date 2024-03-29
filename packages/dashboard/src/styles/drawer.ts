import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { drawerWidth } from './index';

const useStyles = makeStyles(({ transitions, mixins, spacing, breakpoints }: Theme) => ({
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
        [breakpoints.down('md')]: {
            border: 0,
            width: '1px', // bugs in 0px, iOS <- I think it is fixed now
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: spacing(0, 1),
        ...mixins.toolbar,
    },
    icon: {
        margin: spacing(0, 1),
    },
}));

export default useStyles;
