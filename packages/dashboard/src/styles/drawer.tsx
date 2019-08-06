import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/styles/createStyles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';

import { drawerWidth } from './index';

const useStyles = makeStyles(({ transitions, mixins, spacing, breakpoints }: Theme) => createStyles({
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
            width: 0, // bugs in 0px, iOS <- I think it is fixed now
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: `0 ${spacing(1)}px`,
        ...mixins.toolbar,
    },
    icon: {
        margin: `0 ${spacing(1)}px`
    }
}));

export default useStyles;
