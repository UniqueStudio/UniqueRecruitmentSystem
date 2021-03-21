import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: `0 ${spacing(3)}px`,
        [breakpoints.down('xs')]: {
            padding: `0 ${spacing(1)}px ${spacing(2)}px`,
        },
        marginBottom: spacing(3),
    },
    paper: {
        marginTop: spacing(2),
        padding: spacing(2),
        display: 'flex',
        flexDirection: 'column',
        minWidth: 250,
        maxWidth: 900,
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        minWidth: 500,
        marginBottom: spacing(1),
    },
    tableCell: {
        textAlign: 'center',
    },
    title: {
        display: 'flex',
        justifyContent: 'space-around',
    },
}));

export default useStyles;
