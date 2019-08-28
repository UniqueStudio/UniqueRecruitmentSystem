import { createStyles, Theme } from '@material-ui/core/styles';
import CustomTheme from './theme';

const {
    palette: { primary },
    font
} = CustomTheme;

const styles = ({ breakpoints }: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0
        },
        svg: {
            fill: primary.main,
            height: '70px',
            [breakpoints.down('md')]: {
                height: '50px'
            }
        },
        title: {
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
            }
        },
        description: {
            fontFamily: font.family,
            color: primary.lightLittle,
            fontWeight: 'bold',
            fontSize: '20px'
        }
    });

export default styles;
