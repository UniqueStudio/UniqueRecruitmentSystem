import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ spacing, typography, breakpoints }: Theme) => createStyles({
    paper: {
        display: 'flex',
        margin: spacing.unit,
        width: 300,
        height: 300,
        verticalAlign: 'top',
        position: 'relative',
    },
    newButton: {
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    newButtonRoot: {
        height: 'auto',
        width: 'auto',
    },
    newIcon: {
        fontSize: 144,
    },
    tooltip: {
        fontSize: typography.button.fontSize,
    },
    newContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `0 ${spacing.unit * 2}px ${spacing.unit * 2}px`,
    },
    textField: {
        width: 200,
        [breakpoints.down('xs')]: {
            width: 150,
        },
        margin: spacing.unit,
    },
    datePicker: {
        width: 200,
        [breakpoints.down('xs')]: {
            width: 150,
        },
        margin: spacing.unit,
    }
});

export default styles;
