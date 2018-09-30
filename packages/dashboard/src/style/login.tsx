import { Theme } from '@material-ui/core/styles';
import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

const styles: StyleRulesCallback = (theme: Theme) => ({
    login: {
        height: 400,
        [theme.breakpoints.down('xs')]: {
            width: 300,
        },
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;
