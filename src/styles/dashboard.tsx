import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { colorToAlpha } from './index';

const styles = ({ spacing: { unit }, palette, typography, breakpoints }: Theme) => createStyles({
    left: {
        width: '70%',
        margin: unit
    },
    right: {
        flexGrow: 1,
        margin: unit
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
        [breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
        margin: `0 ${unit * 2}px`
    },
    blocksContainer: {
        marginTop: unit
    },
    block: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        verticalAlign: 'bottom'
    },
    chart: {
        display: 'flex',
        margin: unit,
        width: 300,
        height: 300,
        verticalAlign: 'top',
        position: 'relative',
    },
    expired: {
        background: colorToAlpha(palette.secondary.light, 0.1),
    },
    tooltip: {
        fontSize: typography.button.fontSize,
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
    paper: {
        marginTop: unit * 3,
        padding: unit * 2,
        minHeight: 300,
        minWidth: 300,
    },
    title: {
        userSelect: 'none'
    }
});

export default styles;
