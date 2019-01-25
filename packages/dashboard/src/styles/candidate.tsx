import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = ({ breakpoints, spacing, zIndex }: Theme) => createStyles({
    cardContainer: {
        padding: `${spacing.unit / 2}px ${spacing.unit}px`,
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
            'margin': `${spacing.unit}px 0`,
            '& button': {
                padding: spacing.unit,
                minWidth: 80,
            },
        },
    },
    cardContent: {
        margin: spacing.unit,
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
    },
    cardTitle: {
        userSelect: 'none',
    },
    // cardTitleQuick: {
    //     '&:after': {
    //         content: '" ★"',
    //         color: yellow['700']
    //     }
    // },
    // cardTitleMale: {
    //     color: blue.A400,
    // },
    // cardTitleFemale: {
    //     color: pink.A400
    // },
    popper: {
        pointerEvents: 'none',
    },
    popperRoot: {
        padding: spacing.unit,
    },
    iconButton: {
        marginLeft: 'auto',
    },
    comment: {
        width: '50%',
        margin: spacing.unit,
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
            'margin': `${spacing.unit}px 0`,
            '& button': {
                width: 'auto',
                height: 'auto',
            },
        },
        overflowY: 'auto',
        margin: spacing.unit * 2,
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        [breakpoints.up('md')]: {
            marginRight: spacing.unit * 2,
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
            marginLeft: spacing.unit / 2,
            marginRight: spacing.unit / 2,
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
