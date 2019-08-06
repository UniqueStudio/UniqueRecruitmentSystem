import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/styles/createStyles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => createStyles({
    board: {
        height: '100%',
        [breakpoints.down('xs')]: {
            minWidth: '100vw',
        },
    },
    columnsContainer: {
        height: '100%',
        padding: `${spacing(3)}px ${spacing(1)}px 0`,
        [breakpoints.up('sm')]: {
            padding: `${spacing(3)}px ${spacing(3)}px 0`,
            display: 'inline-flex',
        },
    },
}));

export default useStyles;
