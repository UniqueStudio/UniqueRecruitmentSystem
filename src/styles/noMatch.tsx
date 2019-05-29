import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ breakpoints }: Theme) => createStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    logo: {
        width: '50%',
        minWidth: 300,
        userSelect: 'none'
    },
    fourOFour: {
        [breakpoints.down('xs')]: {
            display: 'none',
        },
        width: '100%',
        userSelect: 'none'
    },
});

export default styles;
