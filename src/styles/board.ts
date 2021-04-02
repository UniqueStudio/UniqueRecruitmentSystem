import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    columnsContainer: {
        [breakpoints.up('sm')]: {
            paddingTop: spacing(1),
            display: 'inline-flex',
        },
        [breakpoints.down('xs')]: {
            flexGrow: 1,
        },
    },
    tabContainer: {
        height: '100%',
    },
}));

export default useStyles;
