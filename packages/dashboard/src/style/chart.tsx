import { Theme } from '@material-ui/core/styles';
import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

import { colorToAlpha } from './index';

const styles: StyleRulesCallback = (theme: Theme) => ({
    chartContainer: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    chart: {
        display: 'flex',
        margin: theme.spacing.unit,
        width: 300,
        height: 300,
        verticalAlign: 'top',
        position: 'relative',
    },
    detail: {
        margin: theme.spacing.unit * 2,
        overflowY: 'auto',
    },
    commonTime: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    formGroup: {
        flexDirection: 'row',
    },
    expansion: {
        margin: theme.spacing.unit,
    },
    expired: {
        background: colorToAlpha(theme.palette.secondary.light, 0.1),
    },
    newButton: {
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    newButtonRoot: {
        height: 'auto',
        width: 'auto',
    },
    newIcon: {
        fontSize: 144,
    },
    tooltip: {
        fontSize: theme.typography.button.fontSize,
    },
    newContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `0 ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
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
    select: {
        width: 100,
        margin: theme.spacing.unit,
    },
    picker: {
        width: 200,
        [theme.breakpoints.down('xs')]: {
            width: 150,
        },
        margin: theme.spacing.unit,
    },
});

export default styles;
