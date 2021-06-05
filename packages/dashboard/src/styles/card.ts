import { alpha, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface Props {
    disabled: boolean;
    white: boolean;
    good: number;
    fair: number;
}

const useStyles = makeStyles(({ breakpoints, spacing, zIndex, palette }: Theme) => {
    const R = alpha(palette.error.main, 0.1);
    const Y = alpha(palette.warning.main, 0.1);
    const G = alpha(palette.success.main, 0.1);

    return {
        cardContainer: {
            padding: `${spacing(0.5)} ${spacing(1)}`,
            [breakpoints.down('sm')]: {
                padding: spacing(0.5),
            },
        },
        card: ({ disabled, white, good, fair }: Props) => ({
            position: 'relative',
            zIndex: zIndex.drawer,
            cursor: 'pointer',
            background: disabled
                ? alpha(palette.text.primary, 0.1)
                : white
                ? 'rgba(0, 0, 0, 0)'
                : `linear-gradient(to right, ${G}, ${G} ${good}%, ${Y} ${good}%, ${Y} ${fair}%, ${R} ${fair}%, ${R})`,
        }),
        cardAction: {
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            [breakpoints.down('md')]: {
                margin: `${spacing(1)} 0`,
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
    };
});

export default useStyles;
