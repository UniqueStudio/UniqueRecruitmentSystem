import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ spacing: { unit }, breakpoints }: Theme) => createStyles({
    container: {
        minWidth: 400,
        marginTop: unit * 3,
        padding: `0 ${unit * 3}px`,
        [breakpoints.up('md')]: {
            justifyContent: 'space-around',
            minWidth: 0,
        },
        [breakpoints.down('md')]: {
            padding: `0 ${unit * 2}px`,
            width: '100%'
        },
        [breakpoints.down('xs')]: {
            padding: `0 ${unit}px`,
        },
    },
    paper: {
        flexDirection: 'column',
        margin: `${unit * 2}px 0`,
        width: '45%',
        [breakpoints.down('md')]: {
            width: '100%',
            minWidth: 400
        },
        display: 'inline-block',
        height: '100%',
        verticalAlign: 'top'
    },
    data: {
        margin: unit * 2,
        display: 'flex',
        flexDirection: 'column'
    },
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        [breakpoints.down('md')]: {
            maxWidth: 500
        },
    },
    textField: {
        width: 50,
        margin: unit,
        [breakpoints.down('xs')]: {
            margin: unit / 2,
        },
    },
    dates: {
        flexDirection: 'row',
    },
    datePicker: {
        margin: unit,
        width: 150,
        [breakpoints.down('md')]: {
            margin: unit / 2,
            width: 90,
        },
    },
    dateSelection: {
        margin: unit,
        width: 150,
    },
    buttonContainer: {
        '& button': {
            margin: unit
        }
    },
    tableButtons: {
        display: 'inline-block',
        marginLeft: 'auto',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        marginBottom: unit,
        minWidth: 400
    },
    tableCell: {
        padding: unit,
        textAlign: 'center',
    },
    title: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    dialog: {
        margin: unit * 2,
        display: 'flex',
        alignItems: 'baseline'
    },
});

export default styles;
