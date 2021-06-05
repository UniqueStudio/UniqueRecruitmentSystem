import { createStyles, Theme } from '@material-ui/core/styles';
import CustomTheme from './theme';

const { font } = CustomTheme;

const styles = ({ breakpoints }: Theme) =>
    createStyles({
        font: {
            fontFamily: font.family,
            fontSize: '18px',
            '@media screen and (max-width: 1600px)': {
                fontSize: '16px',
            },
            '@media screen and (max-width: 1440px)': {
                fontSize: '14px',
            },
            [breakpoints.down('md')]: {
                fontSize: '15px',
            },
            [breakpoints.down('sm')]: {
                fontSize: '12px',
            },
            '@media screen and (max-width: 800px)': {
                fontSize: '12px',
            },
            [breakpoints.down('xs')]: {
                fontSize: '14px',
            },
            '@media screen and (max-width: 374.5px)': {
                fontSize: '12px',
            },
        },
    });

export default styles;
