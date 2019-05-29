import { createStyles } from '@material-ui/styles';

import { dangerColor, infoColor, successColor, warningColor } from './index';

const styles = () => createStyles({
    success: { backgroundColor: successColor },
    error: { backgroundColor: dangerColor },
    warning: { backgroundColor: warningColor },
    info: { backgroundColor: infoColor },
});

export default styles;
