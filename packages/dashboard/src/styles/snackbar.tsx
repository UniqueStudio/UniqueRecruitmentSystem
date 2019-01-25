import createStyles from '@material-ui/core/styles/createStyles';

import { dangerColor, infoColor, successColor, warningColor } from './index';

const styles = () => createStyles({
    success: { backgroundColor: successColor },
    error: { backgroundColor: dangerColor },
    warning: { backgroundColor: warningColor },
    info: { backgroundColor: infoColor },
});

export default styles;
