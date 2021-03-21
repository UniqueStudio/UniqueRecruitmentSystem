import { makeStyles } from '@material-ui/core';

import { colorToAlpha } from './index';

const useStyles = makeStyles(({ spacing, palette, typography: { button } }) => ({
    container: {
        width: 300,
        margin: spacing(1),
    },
    btn: {
        width: '100%',
    },
    chart: {
        display: 'flex',
        height: 300,
        width: '100%',
        verticalAlign: 'top',
        position: 'relative',
    },
    selected: {
        boxShadow: `inset 0px 0px 0px 4px ${palette.primary.light}`,
    },
    expired: {
        background: colorToAlpha(palette.grey[200], 0.1),
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
