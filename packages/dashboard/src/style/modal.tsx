import { Theme } from '@material-ui/core/styles';
import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

import { colorToShadow } from './index';

const styles: StyleRulesCallback = (theme: Theme) => ({
    modalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        borderRadius: 6,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit,
        outline: 'none',
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100%',
        },
        maxHeight: '90%',
        maxWidth: '75%',
    },
    modalHeader: {
        background: theme.palette.primary.light,
        borderRadius: 3,
        marginTop: -theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 5,
        marginRight: theme.spacing.unit * 5,
        marginBottom: theme.spacing.unit,
        boxShadow: colorToShadow(theme.palette.primary.light),
        userSelect: 'none',
    },
    modalTitle: {
        color: theme.palette.secondary.contrastText,
        textAlign: 'center',
        margin: theme.spacing.unit,
    },
});

export default styles;
