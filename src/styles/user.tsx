import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ breakpoints, spacing: { unit } }: Theme) => createStyles({
    container: {
        minWidth: 300,
        maxWidth: 900,
        margin: `0 ${unit * 3}px`,
        [breakpoints.down('xs')]: {
            padding: unit,
            margin: `0 ${unit}px`,
        },
        padding: unit * 2,
    },
    title: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    userInfo: {
        padding: unit,
        width: '25%',
        [breakpoints.down('sm')]: {
            width: '50%',
        },
        [breakpoints.down('xs')]: {
            width: '100%',
        },
    },
});

export default styles;
