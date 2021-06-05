import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ zIndex }: Theme) => ({
    progress: {
        position: 'fixed',
        zIndex: zIndex.modal + 1,
        top: 0,
        left: 0,
        width: '100%',
    },
}));

export default useStyles;
