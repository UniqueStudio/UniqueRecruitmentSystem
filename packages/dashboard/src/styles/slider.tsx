import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
    detailContent: {
        display: 'flex',
        [breakpoints.down('sm')]: {
            'margin': `${spacing(1)}px ${spacing(2)}px`,
            '& button': {
                width: 'auto',
                height: 'auto',
            },
        },
        [breakpoints.down('xs')]: {
            'margin': spacing(1),
        },
        overflowY: 'auto',
        margin: spacing(2),
    },
    detailMain: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        [breakpoints.up('lg')]: {
            flexDirection: 'row',
        },
    },
    leftButton: {
        transform: 'rotate(90deg)',
        alignSelf: 'center',
        padding: spacing(1),
        [breakpoints.down('sm')]: {
            padding: 0
        },
    },
    rightButton: {
        transform: 'rotate(-90deg)',
        alignSelf: 'center',
        padding: spacing(1),
        [breakpoints.down('sm')]: {
            padding: 0
        },
    },
});

export default styles;
