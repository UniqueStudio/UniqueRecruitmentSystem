import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ breakpoints, spacing: { unit }, zIndex }: Theme) => createStyles({
    cardContainer: {
        padding: `${unit / 2}px ${unit}px`,
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
            'margin': `${unit}px 0`,
            '& button': {
                padding: unit,
                minWidth: 80,
            },
        },
    },
    cardContent: {
        margin: unit,
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
        padding: unit,
    },
    iconButton: {
        marginLeft: 'auto',
    },
    comment: {
        width: '50%',
        margin: unit,
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
            'margin': `${unit}px`,
            '& button': {
                width: 'auto',
                height: 'auto',
            },
        },
        overflowY: 'auto',
        margin: unit * 2,
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        [breakpoints.up('md')]: {
            marginRight: unit * 2,
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
            marginLeft: unit / 2,
            marginRight: unit / 2,
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
