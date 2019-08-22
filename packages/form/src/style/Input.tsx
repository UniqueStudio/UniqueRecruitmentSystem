import { createStyles, Theme } from '@material-ui/core/styles';
import combineStyles from '../utils/combindStyles';
import borderStyles from './Border';
import fontStyle from './Font';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const style = ({ breakpoints }: Theme) =>
    createStyles({
        container: {
            height: '50px',
            width: 'fit-content',
            display: 'flex',
            '& > div': {
                height: '100%'
            },
            '@media screen and (max-width: 1440px)': {
                height: '40px'
            }
        },
        item: {
            height: '100%'
        },
        label: {
            width: '100%',
            height: '100%',
            borderTopRightRadius: '0 !important',
            borderBottomRightRadius: '0 !important',
            borderWidth: '0 !important',
            backgroundColor: primary.main,
            userSelect: 'none'
        },
        labelText: {
            color: 'white',
            fontWeight: 700,
            [breakpoints.down('xs')]: {
                fontWeight: 'normal'
            },
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        input: {
            width: '100%',
            height: '100%',
            borderTopLeftRadius: '0 !important',
            borderBottomLeftRadius: '0 !important',
            borderLeftWidth: '0 !important',
            '& input': {
                padding: '0 0 0 10px',
                height: '100%'
            }
        },
        inputText: {}
    });

const styles = combineStyles(style, borderStyles, fontStyle);

export default styles;
