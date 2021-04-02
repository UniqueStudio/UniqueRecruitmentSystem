import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 300px))',
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
