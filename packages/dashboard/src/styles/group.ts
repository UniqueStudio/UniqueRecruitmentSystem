import { makeStyles } from '@material-ui/core';

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
