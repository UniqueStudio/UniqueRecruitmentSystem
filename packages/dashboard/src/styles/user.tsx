import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ breakpoints, spacing: { unit } }: Theme) => createStyles({
    container: {
        minWidth: 300,
        maxWidth: 900,
        margin: `${unit * 3}px ${unit * 3}px 0`,
        [breakpoints.down('xs')]: {
            padding: unit,
            margin: `${unit * 3}px ${unit}px 0`,
        },
        padding: unit * 2,
    },
    title: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    userInfo: {
        margin: unit * 2,
        width: '25%',
        [breakpoints.down('sm')]: {
            width: '45%',
            margin: unit,
        },
        [breakpoints.down('xs')]: {
            width: '95%',
        },
    },
});

export default styles;
