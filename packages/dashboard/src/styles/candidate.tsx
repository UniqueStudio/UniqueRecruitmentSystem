import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

const styles = ({ breakpoints, spacing, zIndex }: Theme) => createStyles({
    cardContainer: {
        padding: `${spacing(0.5)}px ${spacing(1)}px`,
    },
    card: {
        position: 'relative',
        zIndex: zIndex.drawer,
        cursor: 'pointer',
    },
    cardAction: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        [breakpoints.down('sm')]: {
            'margin': `${spacing(1)}px 0`,
            '& button': {
                padding: spacing(1),
                minWidth: 80,
            },
        },
    },
    cardContent: {
        margin: spacing(1),
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
    },
    cardTitle: {
        userSelect: 'none',
    },
    popper: {
        pointerEvents: 'none',
    },
    popperRoot: {
        padding: spacing(1),
    },
    iconButton: {
        marginLeft: 'auto',
    },
    comment: {
        width: '50%',
        margin: spacing(1),
    },
    comments: {
        [breakpoints.up('md')]: {
            width: 360,
        },
        width: 250,
    },
    introContent: {
        display: 'flex',
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
        [breakpoints.up('md')]: {
            marginRight: spacing(2),
        },
        minHeight: 450,
        justifyContent: 'space-around',
    },
    detailRow: {
        'display': 'flex',
        [breakpoints.up('md')]: {
            width: 400,
        },
        'width': 250,
        '& *': {
            marginLeft: spacing(0.5),
            marginRight: spacing(0.5),
        },
        '& button': {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    svg: {
        verticalAlign: 'middle'
    }
});

export default styles;
