import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import combineStyles from '../utils/combindStyles';

import borderStyles from './Border';
import fontStyle from './Font';
import CustomTheme from './theme';

const {
    palette: { primary },
} = CustomTheme;

const style = ({ breakpoints, spacing }: Theme) =>
    createStyles({
        container: {
            position: 'relative',
            width: '100%',
            height: `calc(100% - ${spacing(2)}px)`,
            margin: spacing(1, 0),
        },
        textLabel: {
            userSelect: 'none',
            color: 'white',
            fontWeight: 700,
            height: '30px',
            position: 'absolute',
            left: '3vw',
            top: '-15px',
            backgroundColor: primary.main,
            transform: 'skewX(-20deg)',
            display: 'flex',
            alignItems: 'center',
            '& div': {
                transform: 'skewX(20deg)',
                padding: spacing(0, 2),
                letterSpacing: spacing(0.5),
            },
            [breakpoints.down('xs')]: {
                height: '24px',
                top: '-12px',
                left: '0',
                right: '0',
                margin: '0 auto',
                width: 'fit-content',
            },
        },
        textarea: {
            resize: 'none',
            outline: 'none',
            height: `calc(100% - ${spacing(6)}px)`,
            width: '100%',
            padding: spacing(0, 3),
            margin: spacing(3, 0),
            border: 0,
            backgroundColor: 'transparent',
            [breakpoints.down('xs')]: {
                margin: spacing(4, 0),
                padding: spacing(0, 2),
                height: '150px',
            },
        },
    });

const styles = combineStyles(borderStyles, fontStyle, style);

export default makeStyles(styles);
