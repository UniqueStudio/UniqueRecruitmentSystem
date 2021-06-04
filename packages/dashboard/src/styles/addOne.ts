import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, typography: { button } }: Theme) => ({
    paper: {
        display: 'flex',
        margin: spacing(1),
        width: 300,
        minHeight: 300,
    },
    newButton: {
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    newButtonRoot: {
        height: 'auto',
        width: 'auto',
    },
    newIcon: {
        fontSize: 144,
    },
    tooltip: {
        fontSize: button.fontSize,
    },
    newContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: spacing(1),
    },
    button: {
        marginTop: spacing(2),
    },
}));

export default useStyles;
