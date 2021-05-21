import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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
