import { createStyles, Theme } from '@material-ui/core/styles';
import combindStyles from '../utils/combindStyles';
import borderStyles from './Border';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const style = ({ spacing }: Theme) =>
    createStyles({
        menuItem: {
            fontSize: '10px',
            fontWeight: 400,
            minHeight: 'unset',
            paddingTop: spacing(1),
            paddingBottom: spacing(1)
        },
        hightlightedItem: {
            fontWeight: 'bold',
            backgroundColor: primary.lighter
        },
        container: {
            position: 'relative'
        },
        suggestionsContainer: {
            position: 'absolute',
            left: '9%',
            maxHeight: '30vh',
            overflowY: 'auto',
            zIndex: 999,
            width: 'fit-content'
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            listStyleType: 'none'
        }
    });

const styles = combindStyles(style, borderStyles);

export default styles;
