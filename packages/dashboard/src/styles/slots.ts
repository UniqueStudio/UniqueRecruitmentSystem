import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
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
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
}));

export default useStyles;
