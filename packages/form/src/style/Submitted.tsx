import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CustomTheme from './theme';

const {
    palette: { primary },
    font
} = CustomTheme;

const styles = ({ breakpoints, spacing }: Theme) =>
    createStyles({
        container: {
            height: '100%',
            width: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            [breakpoints.down('xs')]: {
                position: 'fixed',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }
        },
        box: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            [breakpoints.down('xs')]: {
                padding: spacing(4, 2),
                backgroundColor: 'white',
                maxWidth: '85%',
                borderRadius: '8px'
            }
        },
        svg: {
            userSelect: 'none',
            fill: primary.main,
            height: '70px',
            [breakpoints.down('md')]: {
                height: '50px'
            },
            [breakpoints.down('xs')]: {
                height: '30px'
            }
        },
        title: {
            userSelect: 'none',
            fontFamily: font.family,
            color: primary.main,
            fontWeight: 'bold',
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '50px',
            [breakpoints.down('md')]: {
                fontSize: '40px'
            },
            [breakpoints.down('xs')]: {
                fontSize: '26px'
            }
        },
        description: {
            userSelect: 'none',
            fontFamily: font.family,
            color: primary.lightLittle,
            fontWeight: 'bold',
            fontSize: '20px',
            [breakpoints.down('xs')]: {
                fontSize: '14px'
            }
        }
    });

export default makeStyles(styles);
