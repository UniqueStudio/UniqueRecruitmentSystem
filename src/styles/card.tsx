import { makeStyles } from '@material-ui/core';

import { colorToAlpha, dangerColor, successColor, warningColor } from './index';

const R = colorToAlpha(dangerColor, 0.1);
const Y = colorToAlpha(warningColor, 0.1);
const G = colorToAlpha(successColor, 0.1);

interface Props {
    disabled: boolean;
    white: boolean;
    good: number;
    soSo: number;
}

const useStyles = makeStyles(({ breakpoints, spacing, zIndex }) => ({
    cardContainer: {
        padding: `${spacing(0.5)}px ${spacing(1)}px`,
        [breakpoints.down('xs')]: {
            padding: spacing(0.5),
        },
    },
    card: ({ disabled, white, good, soSo }: Props) => ({
        position: 'relative',
        zIndex: zIndex.drawer,
        cursor: 'pointer',
        background: disabled
            ? 'rgba(0, 0, 0, 0.1)'
            : white
            ? 'rgba(0, 0, 0, 0)'
            : `linear-gradient(to right, ${G}, ${G} ${good}%, ${Y} ${good}%, ${Y} ${soSo}%, ${R} ${soSo}%, ${R})`,
    }),
    cardAction: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        [breakpoints.down('sm')]: {
            margin: `${spacing(1)}px 0`,
            '& button': {
                padding: spacing(1),
                minWidth: 80,
            },
        },
    },
    cardContent: {
        margin: spacing(1),
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
    },
    cardTitle: {
        userSelect: 'none',
    },
    popper: {
        pointerEvents: 'none',
    },
    popperRoot: {
        padding: spacing(1),
    },
    iconButton: {
        marginLeft: 'auto',
    },
    svg: {
        verticalAlign: 'middle',
    },
}));

export default useStyles;
