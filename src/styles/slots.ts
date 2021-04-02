import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    },
    slotContainer: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-around',
    },
    dateTextField: {
        width: spacing(12),
    },
    numberTextField: {
        width: spacing(5),
    },
}));

export default useStyles;
