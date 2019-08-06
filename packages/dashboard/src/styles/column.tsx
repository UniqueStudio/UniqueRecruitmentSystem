import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/styles/createStyles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';

import { colorToShadow } from './index';

const useStyles = makeStyles(({ spacing, palette, breakpoints }: Theme) => createStyles({
    column: {
        margin: spacing(1),
        [breakpoints.down('xs')]: {
            margin: `${spacing(2)}px ${spacing(0.5)}px`,
            height: `calc(100vh - ${spacing(14)}px)`,
        },
        padding: spacing(1),
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    columnHeader: {
        background: palette.primary.light,
        borderRadius: 3,
        marginTop: -spacing(3),
        marginLeft: spacing(5),
        marginRight: spacing(5),
        marginBottom: spacing(1),
        boxShadow: colorToShadow(palette.primary.light),
        userSelect: 'none',
    },
    columnTitle: {
        color: palette.secondary.contrastText,
        textAlign: 'center',
        margin: spacing(1),
    },
    columnBody: {
        marginBottom: spacing(1),
        [breakpoints.down('xs')]: {
            overflowY: 'auto',
            width: '100%',
        },
        width: 360,
        paddingTop: spacing(1),
    },
}));

export default useStyles;
