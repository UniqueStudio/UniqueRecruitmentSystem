import { makeStyles } from '@material-ui/core';

import { dangerColor, infoColor, successColor, warningColor } from './index';

const useStyles = makeStyles(() => ({
    success: { backgroundColor: successColor },
    error: { backgroundColor: dangerColor },
    warning: { backgroundColor: warningColor },
    info: { backgroundColor: infoColor },
}));

export default useStyles;
