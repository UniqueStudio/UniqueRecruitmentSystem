import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ spacing: { unit }, breakpoints }: Theme) => createStyles({
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: `0 ${unit * 3}px`,
        [breakpoints.down('xs')]: {
            padding: `0 ${unit}px ${unit * 2}px`,
        },
    },
    paper: {
        marginTop: unit * 2,
        padding: unit * 2,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 300,
        maxWidth: 900,
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
    },
    button: {
        margin: unit,
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        minWidth: 500,
        marginBottom: unit,
    },
    tableCell: {
        padding: unit,
        textAlign: 'center',
    },
    title: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    chooseContainer: {
        margin: unit * 2,
        display: 'flex',
        flexDirection: 'column',
    },
    choose: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
    },
    chip: {
        margin: unit,
    },
    textField: {
        width: 100,
        margin: unit,
        [breakpoints.down('sm')]: {
            width: 70,
        },
        [breakpoints.down('xs')]: {
            width: 50,
            margin: unit / 2,
        },
    },
    notification: {
        margin: unit,
    },
    dialog: {
        margin: unit * 2,
    },
    smsDetail: {
        margin: unit * 2,
    },
    placeInput: {
        marginTop: unit,
    },
    timeSelect: {
        marginRight: unit,
    },
});

export default styles;
