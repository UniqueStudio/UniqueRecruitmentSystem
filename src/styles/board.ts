import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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
