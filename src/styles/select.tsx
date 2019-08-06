import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/styles/createStyles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => createStyles({
    select: {
        marginLeft: spacing(4),
        '& *': {
            color: 'white !important',
        },
        '&:before, &:after': {
            display: 'none',
        },
        '& *:focus': {
            background: 'none',
        },
        [breakpoints.down('xs')]: {
            marginLeft: 0
        }
    },
}));

export default useStyles;
