import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    template: {
        overflowY: 'auto',
        margin: spacing(2),
    },
    templateItem: {
        [breakpoints.down('sm')]: {
            margin: spacing(0.5),
        },
        margin: spacing(1),
    },
    lastStep: {
        paddingLeft: 0,
    },
    inputContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(auto, 160px))',
        [breakpoints.down('md')]: {
            gridTemplateColumns: 'repeat(2, minmax(auto, 160px))',
        },
        rowGap: spacing(2),
        columnGap: spacing(1),
    },
    fullWidth: {
        overflowWrap: 'anywhere',
        gridColumn: '1 / 5',
        [breakpoints.down('md')]: {
            gridColumn: '1 / 3',
        },
    },
}));

export default useStyles;
