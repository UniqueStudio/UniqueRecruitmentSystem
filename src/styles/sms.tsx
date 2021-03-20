import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    template: {
        margin: spacing(2),
        width: spacing(100),
        overflowY: 'auto',
        [breakpoints.down('md')]: {
            width: spacing(80),
        },
        [breakpoints.down('sm')]: {
            width: 'auto',
        },
        [breakpoints.down('xs')]: {
            margin: spacing(1),
        },
    },
    stepper: {
        [breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    templateContent: {
        minHeight: spacing(3),
        display: 'flex',
        alignItems: 'baseline',
    },
    templateParams: {
        display: 'flex',
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
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        [breakpoints.down('xs')]: {
            width: spacing(12),
        },
        width: spacing(15),
    },
    picker: {
        display: 'block',
    },
}));

export default useStyles;
