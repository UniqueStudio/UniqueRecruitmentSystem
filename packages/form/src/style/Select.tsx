import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import combineStyles from '../utils/combindStyles';
import borderStyles from './Border';
import fontStyles from './Font';
import heightStyles from './Height';
import CustomTheme from './theme';

const {
    palette: { primary },
    font
} = CustomTheme;

const style = ({ breakpoints, spacing }: Theme) =>
    createStyles({
        root: {
            fontFamily: font.family,
            color: primary.main,
            minWidth: '10vw',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '@media screen and (min-width: 1440px)': {
                '&:hover': {
                    borderColor: primary.lightLittleMore
                }
            }
        },
        select: {
            '&:focus': {
                backgroundColor: 'inherit'
            }
        },
        menu: {
            maxHeight: '30vh',
            overflowY: 'auto',
            '& ul': {
                paddingTop: 0,
                paddingBottom: 0
            }
        },
        menuItem: {
            textAlign: 'center',
            minHeight: 'unset',
            fontFamily: font.family,
            color: primary.main,
            justifyContent: 'center',
            '&:focus,&:hover': {
                backgroundColor: primary.light
            }
        },
        svg: {
            position: 'absolute',
            pointerEvents: 'none',
            height: '24px',
            transform: 'rotate(90deg)',
            transition: 'transform 0.2s',
            top: 'calc(100%-12px)',
            right: '12px',
            [breakpoints.down('md')]: {
                height: '22px',
                top: 'calc(100%-11px)',
                right: '11px'
            },
            [breakpoints.down('sm')]: {
                height: '18px',
                top: 'calc(100%-9px)',
                right: '9px'
            },
            [breakpoints.down('xs')]: {
                height: '24px',
                top: 'calc(100%-12px)',
                right: '12px'
            }
        },
        rotateSvg: {
            transform: 'rotate(-90deg)'
        },
        input: {
            paddingLeft: '1.5vw',
            textAlign: 'left',
            [breakpoints.down('xs')]: {
                paddingLeft: '7vw'
            }
        }
    });

const styles = combineStyles(style, borderStyles, fontStyles, heightStyles);

export default makeStyles(styles);
