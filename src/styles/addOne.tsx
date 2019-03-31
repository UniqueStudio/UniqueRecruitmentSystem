import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ spacing: { unit }, typography, breakpoints }: Theme) => createStyles({
    paper: {
        display: 'flex',
        margin: unit,
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
        padding: `0 ${unit * 2}px ${unit * 2}px`,
    },
    textField: {
        width: 200,
        [breakpoints.down('xs')]: {
            width: 150,
        },
        margin: unit,
    },
    datePicker: {
        width: 200,
        [breakpoints.down('xs')]: {
            width: 150,
        },
        margin: unit,
    }
});

export default styles;
