import { createStyles, Theme } from '@material-ui/core/styles';
import CustomTheme from './theme';

const {
    palette: { primary },
    font
} = CustomTheme;

const styles = ({ breakpoints }: Theme) =>
    createStyles({
        root: {
            height: '5vw'
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
                padding: '0 0 0 1vw',
                height: '100%'
            }
        },
        inputText: {},
        font: {
            fontFamily: font.family,
            [breakpoints.up('lg')]: {
                fontSize: '16px'
            },
            [breakpoints.up('sm')]: {
                fontSize: '14px'
            },
            [breakpoints.up('xs')]: {
                fontSize: '12px'
            }
        }
    });

export default styles;
