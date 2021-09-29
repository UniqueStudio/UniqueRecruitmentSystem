import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
    content: {
        display: 'flex',
        alignItems: 'baseline',
    },
    input: {
        marginLeft: spacing(1),
    },
}));

export default useStyles;
