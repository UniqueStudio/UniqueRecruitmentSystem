import { createStyles, Theme } from '@material-ui/core/styles';
import combineStyles from '../utils/combindStyles';
import borderStyles from './Border';
import fontStyle from './Font';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const base = 2;

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
            backgroundColor: primary.main
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
        inputText: {},
        xs1: {
            width: `${base * 1}vw`
        },
        xs2: {
            width: `${base * 2}vw`
        },
        xs3: {
            width: `${base * 3}vw`
        },
        xs4: {
            width: `${base * 4}vw`
        },
        xs5: {
            width: `${base * 5}vw`
        },
        xs6: {
            width: `${base * 6}vw`
        },
        xs7: {
            width: `${base * 7}vw`
        },
        xs8: {
            width: `${base * 8}vw`
        },
        xs9: {
            width: `${base * 9}vw`
        },
        xs10: {
            width: `${base * 10}vw`
        },
        xs11: {
            width: `${base * 11}vw`
        },
        xs12: {
            width: `${base * 12}vw`
        }
    });

const styles = combineStyles(style, borderStyles, fontStyle);

export default styles;
