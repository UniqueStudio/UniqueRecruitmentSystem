import { createStyles, Theme } from '@material-ui/core/styles';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const styles = ({ breakpoints }: Theme) =>
    createStyles({
        border: {
            borderRadius: '12px',
            border: `3px ${primary.light} solid`,
            [breakpoints.between('sm', 'md')]: {
                borderRadius: '8px'
            },
            [breakpoints.down('xs')]: {
                borderWidth: '2px'
            }
        }
    });

export default styles;
