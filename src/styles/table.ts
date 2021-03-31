import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    paper: {
        margin: spacing(2),
        padding: spacing(2),
        [breakpoints.down('sm')]: {
            margin: `${spacing(2)}px ${spacing(1)}px`,
            padding: spacing(1),
            flex: '1 1 0',
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
        margin: `${spacing(1)}px ${spacing(2)}px`,
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
        margin: `${spacing(1)}px ${spacing(0.5)}px`,
    },
}));

export default useStyles;
