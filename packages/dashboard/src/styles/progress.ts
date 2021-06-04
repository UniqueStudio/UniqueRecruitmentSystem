import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ zIndex }) => ({
    progress: {
        position: 'fixed',
        zIndex: zIndex.modal + 1,
        top: 0,
        left: 0,
        width: '100%',
    },
}));

export default useStyles;
