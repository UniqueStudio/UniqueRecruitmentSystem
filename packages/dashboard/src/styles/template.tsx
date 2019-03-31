import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ breakpoints, spacing: { unit } }: Theme) => createStyles({
    template: {
        [breakpoints.down('xs')]: {
            margin: unit,
        },
        margin: unit * 2,
        overflowY: 'auto',
    },
    stepper: {
        [breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    templateContent: {
        minHeight: unit * 3,
        display: 'flex',
        alignItems: 'baseline',
    },
    templateParams: {
        display: 'flex',
    },
    templateItem: {
        [breakpoints.down('xs')]: {
            margin: unit / 2,
        },
        margin: unit,
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
            marginTop: unit,
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
