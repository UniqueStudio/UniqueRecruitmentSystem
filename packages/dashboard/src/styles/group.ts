import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    button: {
        marginLeft: 'auto',
        display: 'block',
    },
}));

export default useStyles;
