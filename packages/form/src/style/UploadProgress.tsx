import { createStyles } from '@material-ui/core/styles';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const styles = () =>
    createStyles({
        root: {
            width: '80%'
        },
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
        barColorPrimary: {
            backgroundColor: primary.main
        },
        colorPrimary: {
            backgroundColor: primary.light
        }
    });

export default styles;
