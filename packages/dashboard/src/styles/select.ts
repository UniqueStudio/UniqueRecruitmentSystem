import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => ({
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
        [breakpoints.down('sm')]: {
            marginLeft: 0,
        },
    },
}));

export default useStyles;
