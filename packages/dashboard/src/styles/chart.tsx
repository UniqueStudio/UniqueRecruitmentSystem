import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/styles/createStyles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';

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
        background: colorToAlpha(palette.secondary.light, 0.1),
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
