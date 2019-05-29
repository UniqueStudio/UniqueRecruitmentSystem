import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ spacing, typography: { button }, breakpoints }: Theme) => createStyles({
    paper: {
        display: 'flex',
        margin: spacing(1),
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
        fontSize: button.fontSize,
    },
    newContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `0 ${spacing(2)}px ${spacing(2)}px`,
    },
    textField: {
        width: 200,
        [breakpoints.down('xs')]: {
            width: 150,
        },
        margin: spacing(1),
    },
    datePicker: {
        width: 200,
        [breakpoints.down('xs')]: {
            width: 150,
        },
        margin: spacing(1),
    }
});

export default styles;
