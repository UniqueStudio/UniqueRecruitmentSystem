import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }) => ({
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        minWidth: 500,
        marginBottom: spacing(1),
    },
    tableCell: {
        textAlign: 'center',
        overflowWrap: 'anywhere',
    },
}));

export default useStyles;
