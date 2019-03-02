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
        marginBottom: unit * 3
    },
    paper: {
        marginTop: unit * 2,
        padding: unit * 2,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 300,
        maxWidth: 900,
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
    }
});

export default styles;
