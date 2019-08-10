import { createStyles, Theme } from '@material-ui/core/styles';
import combineStyles from '../utils/combindStyles';
import borderStyles from './Border';
// import CustomTheme from './theme';

const style = ({ breakpoints, spacing }: Theme) =>
    createStyles({
        root: {}
    });

const styles = combineStyles(borderStyles, style);

export default styles;
