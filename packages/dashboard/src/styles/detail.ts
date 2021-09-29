import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ breakpoints, spacing }: Theme) => ({
    introContent: {
        maxWidth: 720,
        [breakpoints.down('md')]: {
            margin: spacing(1),
        },
        overflowY: 'auto',
        margin: spacing(2),
        whiteSpace: 'pre-line',
    },
    detailRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
        columnGap: spacing(1),
    },
    resumeRow: {
        gridTemplateColumns: '1fr 1fr auto',
    },
    intro: {
        cursor: 'pointer',
    },
}));

export default useStyles;
