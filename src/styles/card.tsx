import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

import { colorToAlpha, dangerColor, successColor, warningColor } from './index';

const red = colorToAlpha(dangerColor, 0.1);
const yellow = colorToAlpha(warningColor, 0.1);
const green = colorToAlpha(successColor, 0.1);

interface Props {
    disabled: boolean;
    white: boolean;
    good: number;
    soSo: number;
}

const useStyles = makeStyles(({ breakpoints, spacing, zIndex }: Theme) =>
    createStyles({
        cardContainer: {
            padding: `${spacing(0.5)}px ${spacing(1)}px`,
            [breakpoints.down('xs')]: {
                padding: spacing(0.5),
            },
        },
        card: ({ disabled, white, good, soSo }: Props) => {
            const goodLeft = Math.min(good - 5, 0);
            const goodRight = Math.max(good + 5, soSo - 5);

            const soSoLeft = Math.min(soSo - 5, goodRight);
            const soSoRight = Math.max(soSo + 5, 100);
            return {
                position: 'relative',
                zIndex: zIndex.drawer,
                cursor: 'pointer',
                background: disabled
                    ? 'rgba(0, 0, 0, 0.1)'
                    : white
                    ? 'rgba(0, 0, 0, 0)'
                    : `linear-gradient(to right, ${green}, ${green} ${goodLeft}%, ${yellow} ${goodRight}%, ${yellow} ${soSoLeft}%, ${red} ${soSoRight}%, ${red})`,
            };
        },
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
    }),
);

export default useStyles;
