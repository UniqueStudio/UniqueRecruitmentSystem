import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => ({
    detailContent: {
        display: 'flex',
        overflow: 'hidden',
        [breakpoints.down('md')]: {
            margin: spacing(1, 2),
        },
        [breakpoints.down('sm')]: {
            margin: spacing(1),
        },
        margin: spacing(2),
    },
    detailMain: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        columnGap: spacing(1),
        width: spacing(100),
        overflowY: 'auto',
    },
    button: {
        alignSelf: 'center',
        padding: spacing(1),
        [breakpoints.down('md')]: {
            padding: 0,
        },
    },
}));

export default useStyles;
