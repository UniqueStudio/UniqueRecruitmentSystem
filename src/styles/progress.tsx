import { makeStyles } from '@material-ui/core';
import pink from '@material-ui/core/colors/pink';

const useStyles = makeStyles(({ zIndex }) => ({
    progress: {
        position: 'fixed',
        zIndex: zIndex.modal + 1,
        top: 0,
        left: 0,
        width: '100%',
    },
    color: {
        backgroundColor: pink[500],
    },
    barColor: {
        backgroundColor: pink[100],
    },
}));

export default useStyles;
