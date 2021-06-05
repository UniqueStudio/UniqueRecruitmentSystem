import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
