import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    columnsContainer: {
        [breakpoints.up('sm')]: {
            paddingTop: spacing(1),
            display: 'flex',
            width: 'max-content',
        },
        [breakpoints.down('sm')]: {
            flexGrow: 1,
        },
    },
    tabContainer: {
        height: '100%',
    },
}));

export default useStyles;
