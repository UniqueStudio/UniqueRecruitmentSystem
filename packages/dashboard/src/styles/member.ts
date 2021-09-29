import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
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
