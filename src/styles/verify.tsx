import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ breakpoints, spacing }: Theme) => createStyles({
    content: {
        minHeight: spacing.unit * 3,
        maxWidth: 700,
        display: 'flex',
        alignItems: 'baseline',
    },
    item: {
        [breakpoints.down('xs')]: {
            margin: spacing.unit / 2,
        },
        margin: spacing.unit,
    },
    input: {
        [breakpoints.down('xs')]: {
            width: 100,
        },
        width: 150,
    },
});

export default styles;
