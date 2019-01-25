import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

import { colorToShadow } from './index';

const styles = ({ palette, shadows, spacing: { unit }, breakpoints }: Theme) => createStyles({
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
        backgroundColor: palette.background.paper,
        boxShadow: shadows[5],
        padding: unit,
        outline: 'none',
        [breakpoints.down('xs')]: {
            maxWidth: '100%',
        },
        maxHeight: '90%',
        maxWidth: '75%',
    },
    modalHeader: {
        background: palette.primary.light,
        borderRadius: 3,
        marginTop: -unit * 3,
        marginLeft: unit * 5,
        marginRight: unit * 5,
        marginBottom: unit,
        boxShadow: colorToShadow(palette.primary.light),
        userSelect: 'none',
    },
    modalTitle: {
        color: palette.secondary.contrastText,
        textAlign: 'center',
        margin: unit,
    },
    backdrop: {
        background: palette.primary.main
    }
});

export default styles;
