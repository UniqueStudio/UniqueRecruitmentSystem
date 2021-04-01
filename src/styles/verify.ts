import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }) => ({
    content: {
        display: 'flex',
        alignItems: 'baseline',
    },
    input: {
        marginLeft: spacing(1),
    },
}));

export default useStyles;
