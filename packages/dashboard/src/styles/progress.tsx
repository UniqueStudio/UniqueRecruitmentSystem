import pink from '@material-ui/core/colors/pink';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ zIndex }: Theme) => createStyles({
    progress: {
        position: 'fixed',
        zIndex: zIndex.modal + 1,
        top: 0,
        left: 0,
        width: '100%',
    },
    color: {
        backgroundColor: pink[500]
    },
    barColor: {
        backgroundColor: pink[100]
    }
}));

export default useStyles;
