import { createStyles, Theme } from '@material-ui/core/styles';
import CustomTheme from './theme';

const {
    palette: { primary }
} = CustomTheme;

const styles = ({ spacing }: Theme) =>
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
        // menu: {
        //     position: 'absolute',
        //     top: 0,
        //     left: '8.4%',
        //     maxHeight: '30vh',
        //     overflowY: 'auto',
        //     zIndex: 999
        // },
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

export default styles;
