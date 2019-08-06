import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/styles/createStyles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles/makeStyles';

const useStyles = makeStyles(({ breakpoints, spacing }: Theme) => createStyles({
    introContent: {
        display: 'flex',
        maxWidth: 720,
        [breakpoints.down('sm')]: {
            'margin': spacing(1),
            '& button': {
                width: 'auto',
                height: 'auto',
            },
        },
        overflowY: 'auto',
        margin: spacing(2),
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        [breakpoints.up('lg')]: {
            marginRight: spacing(2),
        },
        minHeight: 450,
        justifyContent: 'space-around',
    },
    detailRow: {
        display: 'flex',
        [breakpoints.up('md')]: {
            width: 500,
        },
        [breakpoints.up('lg')]: {
            width: 400,
        },
        width: '100%',
        '& *': {
            marginLeft: spacing(0.5),
            marginRight: spacing(0.5),
            flexBasis: '100%'
        },
        '& button': {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
}));

export default useStyles;
