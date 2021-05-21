import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        minWidth: 500,
        marginBottom: spacing(1),
    },
    tableCell: {
        textAlign: 'center',
        [breakpoints.down('sm')]: {
            padding: spacing(0.5),
            minWidth: spacing(10),
        },
    },
}));

export default useStyles;
