import { createStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
// import Mytheme from './theme';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            position: 'relative'
        },
        input: {},
        menuItem: {},
        menu: {
            position: 'absolute',
            overflowY: 'auto',
            height: '30vh'
        }
    });

export default styles;
