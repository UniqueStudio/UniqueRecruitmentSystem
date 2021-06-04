import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ palette, shadows, spacing, breakpoints }: Theme) => ({
    modalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        padding: spacing(1),
        outline: 'none',
        [breakpoints.down('sm')]: {
            maxWidth: '100%',
        },
        maxHeight: '90%',
        maxWidth: '80%',
    },
    modalHeader: {
        background: palette.primary.light,
        borderRadius: 3,
        marginTop: spacing(-3),
        marginLeft: spacing(5),
        marginRight: spacing(5),
        marginBottom: spacing(1),
        boxShadow: shadows[5],
        userSelect: 'none',
    },
    modalTitle: {
        color: palette.primary.contrastText,
        textAlign: 'center',
        margin: spacing(1),
    },
    backdrop: {
        background: palette.primary.main,
    },
}));

export default useStyles;
