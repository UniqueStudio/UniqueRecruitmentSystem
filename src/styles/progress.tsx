import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({zIndex}: Theme) => createStyles({
    progress: {
        position: 'fixed',
        zIndex: zIndex.modal + 1,
        top: 0,
        left: 0,
        width: '100%',
    },
});

export default styles;
