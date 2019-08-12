import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ breakpoints, spacing }: Theme) => createStyles({
    container: {
        minWidth: 250,
        maxWidth: 900,
        margin: `${spacing(3)}px ${spacing(3)}px 0`,
        [breakpoints.down('xs')]: {
            padding: spacing(1),
            margin: `${spacing(3)}px ${spacing(1)}px 0`,
        },
        padding: spacing(2),
    },
    title: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    userInfo: {
        margin: spacing(2),
        width: '25%',
        [breakpoints.down('sm')]: {
            width: '45%',
            margin: spacing(1),
        },
        [breakpoints.down('xs')]: {
            width: '95%',
        },
    },
}));

export default useStyles;
