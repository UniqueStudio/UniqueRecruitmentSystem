import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ breakpoints, spacing }: Theme) => createStyles({
    template: {
        [breakpoints.down('xs')]: {
            margin: spacing.unit,
        },
        margin: spacing.unit * 2,
        overflowY: 'auto',
    },
    stepper: {
        [breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    templateContent: {
        minHeight: spacing.unit * 3,
        width: 700,
        display: 'flex',
        alignItems: 'baseline',
    },
    templateParams: {
        display: 'flex',
    },
    templateItem: {
        [breakpoints.down('xs')]: {
            margin: spacing.unit / 2,
        },
        margin: spacing.unit,
    },
    templateColumn: {
        flexDirection: 'column',
    },
    templateEnd: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    formGroup: {
        flexDirection: 'row',
    },
    dateSelect: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        [breakpoints.down('xs')]: {
            marginTop: spacing.unit,
        },
    },
    verify: {
        paddingLeft: 0,
    },
    inputContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        [breakpoints.down('xs')]: {
            width: 100,
        },
        width: 150,
    },
});

export default styles;
