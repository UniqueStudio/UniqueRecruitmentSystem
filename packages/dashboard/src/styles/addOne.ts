import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, typography: { button } }) => ({
    paper: {
        display: 'flex',
        margin: spacing(1),
        width: 300,
        height: '100%',
        verticalAlign: 'top',
        position: 'relative',
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
