import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    table: {
        overflowX: 'auto',
        '& > div': {
            minWidth: 660,
        },
    },
    dateSelection: {
        margin: spacing(1),
        width: 150,
        [breakpoints.down('xs')]: {
            margin: spacing(0.5),
        },
    },
    tableButton: {
        margin: `${spacing(1)} ${spacing(2)}`,
        [breakpoints.down('xs')]: {
            margin: `0 ${spacing(2)} ${spacing(2)}`,
        },
    },
    dialog: {
        margin: spacing(2),
        [breakpoints.down('xs')]: {
            margin: spacing(1),
        },
        display: 'flex',
        alignItems: 'baseline',
    },
    cell: {
        flexWrap: 'wrap',
        overflowY: 'auto !important' as 'auto',
    },
    chip: {
        margin: `${spacing(1)} ${spacing(0.5)}`,
        [breakpoints.down('xs')]: {
            margin: spacing(0.5),
        },
    },
}));

export default useStyles;
