import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ breakpoints, spacing }: Theme) => ({
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
        gridTemplateColumns: 'repeat(5, minmax(auto, 160px))',
        [breakpoints.down('md')]: {
            gridTemplateColumns: 'repeat(2, minmax(auto, 160px))',
        },
        rowGap: spacing(2),
        columnGap: spacing(1),
    },
    fullWidth: {
        overflowWrap: 'anywhere',
        gridColumn: '1 / 6',
        [breakpoints.down('md')]: {
            gridColumn: '1 / 3',
        },
    },
}));

export default useStyles;
