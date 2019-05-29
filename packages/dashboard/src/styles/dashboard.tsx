import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';
import { colorToAlpha } from './index';

const styles = ({ spacing, palette, typography: { button }, breakpoints }: Theme) => createStyles({
    left: {
        width: '70%',
        margin: spacing(1)
    },
    right: {
        flexGrow: 1,
        margin: spacing(1)
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
        [breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
        margin: `${spacing(3)}px ${spacing(2)}px 0`
    },
    blocksContainer: {
        marginTop: spacing(1)
    },
    block: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        verticalAlign: 'bottom'
    },
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
    paper: {
        marginTop: spacing(3),
        padding: spacing(2),
        minHeight: 300,
        minWidth: 300,
    },
    title: {
        userSelect: 'none'
    }
});

export default styles;
