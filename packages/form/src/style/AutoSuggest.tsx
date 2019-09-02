import { createStyles, Theme } from '@material-ui/core/styles';
import combindStyles from '../utils/combindStyles';
import borderStyles from './Border';
import fontStyles from './Font';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const style = ({ spacing }: Theme) =>
    createStyles({
        menuItem: {
            textAlign: 'center',
            minHeight: 'unset',
            color: primary.main,
            justifyContent: 'center'
        },
        hightlightedItem: {
            backgroundColor: primary.light
        },
        container: {
            position: 'relative'
        },
        suggestionsContainer: {
            position: 'absolute',
            maxHeight: '30vh',
            overflowY: 'auto',
            zIndex: 999
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            listStyleType: 'none'
        }
    });

const styles = combindStyles(borderStyles, fontStyles, style);

export default styles;
