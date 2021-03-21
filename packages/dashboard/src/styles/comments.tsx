import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    evaluation: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        [breakpoints.down('sm')]: {
            margin: `${spacing(1)}px 0`,
            '& button': {
                padding: spacing(1),
                minWidth: 80,
            },
        },
    },
    comment: {
        minWidth: '35%',
        flex: '1 1 0',
        margin: spacing(1),
    },
    comments: {
        [breakpoints.up('lg')]: {
            width: 400,
        },
        margin: spacing(1),
        width: '100%',
    },
}));

export default useStyles;
