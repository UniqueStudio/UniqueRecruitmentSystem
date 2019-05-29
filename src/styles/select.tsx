import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
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
});

export default styles;
