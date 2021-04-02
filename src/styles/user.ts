import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }) => ({
    container: {
        maxWidth: spacing(100),
        margin: 'auto',
    },
    textFieldContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing(2),
    },
}));

export default useStyles;
