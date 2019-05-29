import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ spacing }: Theme) => createStyles({
    expansion: {
        margin: `${spacing(1)}px !important`,
    },
});

export default styles;
