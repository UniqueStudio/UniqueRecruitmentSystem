import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ spacing: { unit } }: Theme) => createStyles({
    expansion: {
        margin: unit,
    },
});

export default styles;
