import { makeStyles } from '@material-ui/core';

import { colorToAlpha } from '@styles/index';

const useStyles = makeStyles(({ spacing, palette }) => ({
    blocksContainer: {
        marginTop: spacing(1),
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'auto',
        justifyContent: 'center',
    },
    block: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        verticalAlign: 'bottom',
    },
    container: {
        width: 300,
        margin: spacing(1),
    },
    btn: {
        width: '100%',
    },
    chartContainer: {
        display: 'flex',
        height: 300,
        width: '100%',
        verticalAlign: 'top',
        position: 'relative',
    },
    chart: {
        position: 'absolute',
    },
    selected: {
        boxShadow: `inset 0px 0px 0px 4px ${palette.primary.light}`,
    },
    expired: {
        background: colorToAlpha(palette.grey[200], 0.5),
    },
    centerText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 128,
        userSelect: 'none',
    },
}));

export default useStyles;
