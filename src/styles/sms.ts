import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    template: {
        overflowY: 'auto',
        [breakpoints.down('sm')]: {
            margin: spacing(2),
        },
    },
    stepper: {
        [breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    templateItem: {
        [breakpoints.down('xs')]: {
            margin: spacing(0.5),
        },
        margin: spacing(1),
    },
    templateColumn: {
        flexDirection: 'column',
    },
    templateEnd: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    formGroup: {
        flexDirection: 'row',
    },
    dateSelect: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        [breakpoints.down('xs')]: {
            marginTop: spacing(1),
        },
    },
    verify: {
        paddingLeft: 0,
    },
    inputContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(auto, 160px))',
        [breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
        },
        rowGap: spacing(2),
        columnGap: spacing(1),
    },
    fullWidth: {
        overflowWrap: 'anywhere',
        [breakpoints.up('md')]: {
            gridColumn: '1 / 6',
        },
    },
}));

export default useStyles;
