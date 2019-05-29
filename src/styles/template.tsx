import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ breakpoints, spacing }: Theme) => createStyles({
    template: {
        [breakpoints.down('xs')]: {
            margin: spacing(1),
        },
        margin: spacing(2),
        overflowY: 'auto',
    },
    stepper: {
        [breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    templateContent: {
        minHeight: spacing(3),
        display: 'flex',
        alignItems: 'baseline',
    },
    templateParams: {
        display: 'flex',
    },
    templateItem: {
        [breakpoints.down('xs')]: {
            margin: spacing(0.5),
        },
        margin: spacing(1),
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
            marginTop: spacing(1),
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
        width: 120,
    },
    picker: {
        display: 'block'
    }
});

export default styles;
