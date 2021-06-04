import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, palette, shadows }: Theme) => ({
    column: {
        margin: spacing(1),
        padding: spacing(1),
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    columnHeader: {
        background: palette.primary.light,
        borderRadius: 3,
        marginTop: spacing(-3),
        marginLeft: spacing(5),
        marginRight: spacing(5),
        marginBottom: spacing(1),
        boxShadow: shadows[5],
        userSelect: 'none',
    },
    columnTitle: {
        color: palette.primary.contrastText,
        textAlign: 'center',
        margin: spacing(1),
    },
    columnBody: {
        width: 360,
        paddingTop: spacing(1),
    },
}));

export default useStyles;
