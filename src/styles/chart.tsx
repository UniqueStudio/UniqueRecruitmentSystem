import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

import { colorToAlpha } from './index';

const useStyles = makeStyles(({ spacing, palette, typography: { button } }: Theme) => createStyles({
    chart: {
        display: 'flex',
        margin: spacing(1),
        width: 300,
        height: 300,
        verticalAlign: 'top',
        position: 'relative',
    },
    expired: {
        background: colorToAlpha(palette.grey[500], 0.1),
    },
    tooltip: {
        fontSize: button.fontSize,
    },
    doughnut: {
        position: 'absolute',
    },
    centerText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 128,
        userSelect: 'none',
    },
}));

export default useStyles;
