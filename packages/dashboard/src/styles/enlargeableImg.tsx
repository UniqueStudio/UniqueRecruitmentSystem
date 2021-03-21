import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ zIndex }) => ({
    imageLayer: {
        maxHeight: '100%',
    },
    image: {
        '&:hover': {
            cursor: 'pointer',
        },
        maxWidth: '100%',
    },
    imageRoot: {
        zIndex: zIndex.snackbar * 4,
    },
}));

export default useStyles;
