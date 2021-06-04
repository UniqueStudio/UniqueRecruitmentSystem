import { alpha, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, palette }) => ({
    blocksContainer: {
        marginTop: spacing(1),
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'auto',
        justifyContent: 'center',
    },
    container: {
        width: 300,
        margin: spacing(1),
    },
    buttonsContainer: {
        display: 'flex',
    },
    timelineContainer: {
        display: 'flex',
        padding: spacing(1),
        flexDirection: 'column',
        alignItems: 'center',
    },
    chartContainer: {
        display: 'flex',
        height: 300,
        position: 'relative',
    },
    chart: {
        position: 'absolute',
    },
    selected: {
        boxShadow: `inset 0px 0px 0px 4px ${palette.secondary.main}`,
    },
    expired: {
        background: alpha(palette.background.default, 0.9),
    },
    centerText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 128,
        userSelect: 'none',
    },
}));

export default useStyles;
