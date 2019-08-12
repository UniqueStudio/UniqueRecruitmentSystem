import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

import { dangerColor, infoColor, successColor, warningColor } from './index';

const useStyles = makeStyles(({ breakpoints }: Theme) => createStyles({
    success: { backgroundColor: successColor },
    error: { backgroundColor: dangerColor },
    warning: { backgroundColor: warningColor },
    info: { backgroundColor: infoColor },
    snackBar: {
        [breakpoints.down('xs')]: {
            width: 'calc(100% - 16px)'
        },
    },
    shrink: {
        [breakpoints.down('xs')]: {
            width: 'calc(100% - 112px)',
        },
    },
}));

export default useStyles;
