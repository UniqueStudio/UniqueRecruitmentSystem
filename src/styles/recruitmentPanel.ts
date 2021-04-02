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
    container: {
        width: 300,
        margin: spacing(1),
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
