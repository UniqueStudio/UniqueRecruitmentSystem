import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ spacing: { unit }, breakpoints }: Theme) => createStyles({
    select: {
        marginLeft: unit * 4,
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
});

export default styles;
