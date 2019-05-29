import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ breakpoints, spacing }: Theme) => createStyles({
    content: {
        minHeight: spacing(3),
        maxWidth: 700,
        display: 'flex',
        alignItems: 'baseline',
    },
    item: {
        [breakpoints.down('xs')]: {
            margin: spacing(0.5),
        },
        margin: spacing(1),
    },
    input: {
        [breakpoints.down('xs')]: {
            width: 100,
        },
        width: 150,
    },
});

export default styles;
