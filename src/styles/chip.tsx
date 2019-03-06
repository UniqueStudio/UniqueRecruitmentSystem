import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

import { mergeKV } from '../utils/mergeKV';

import { colorToAlpha, colorToShadow, dangerColor, infoColor, successColor, warningColor } from './index';

export const colorStyles = mergeKV(['info', 'success', 'warning', 'danger'],
    [infoColor, successColor, warningColor, dangerColor].map((color) => ({
        background: color,
        color: 'white',
        boxShadow: colorToShadow(color),
    })));

const rootColorStyles = mergeKV(['root-info', 'root-success', 'root-warning', 'root-danger'],
    [infoColor, successColor, warningColor, dangerColor].map((color) => ({
        '& span': {
            pointerEvents: 'none',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'inline-block',
        },
        '&:hover': {
            background: colorToAlpha(color, 0.6),
        },
        '&:focus, &:active': {
            background: color,
        },
    }))
);

const styles = ({ spacing: { unit } }: Theme) => createStyles({
    chip: {
        margin: unit,
        cursor: 'pointer',
        maxWidth: 250
    },
    popover: {
        pointerEvents: 'none',
    },
    content: {
        maxWidth: 400,
        padding: unit * 2,
        wordWrap: 'break-word',
    },
    ...colorStyles,
    ...rootColorStyles,
});

export default styles;
