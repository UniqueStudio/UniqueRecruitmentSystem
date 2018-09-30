// import blue from '@material-ui/core/colors/blue';
// import pink from '@material-ui/core/colors/pink';
// import yellow from '@material-ui/core/colors/yellow';
import { Theme } from '@material-ui/core/styles';
import { StyleRulesCallback } from '@material-ui/core/styles/withStyles';

const styles: StyleRulesCallback = (theme: Theme) => ({
    cardContainer: {
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
    },
    card: {
        position: 'relative',
        zIndex: theme.zIndex.drawer,
        cursor: 'pointer',
    },
    cardAction: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            'margin': `${theme.spacing.unit}px 0`,
            '& button': {
                padding: theme.spacing.unit,
                minWidth: 80,
            },
        },
    },
    cardContent: {
        margin: theme.spacing.unit,
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
        padding: theme.spacing.unit,
    },
    iconButton: {
        marginLeft: 'auto',
    },
    comment: {
        width: '50%',
        margin: theme.spacing.unit,
    },
    comments: {
        [theme.breakpoints.up('md')]: {
            width: 360,
        },
        width: 250,
    },
    introContent: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            'margin': `${theme.spacing.unit}px 0`,
            '& button': {
                width: 'auto',
                height: 'auto',
            },
        },
        overflowY: 'auto',
        margin: theme.spacing.unit * 2,
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            marginRight: theme.spacing.unit * 2,
        },
        minHeight: 450,
        justifyContent: 'space-around',
    },
    detailRow: {
        'display': 'flex',
        [theme.breakpoints.up('md')]: {
            width: 400,
        },
        'width': 250,
        '& *': {
            marginLeft: theme.spacing.unit / 2,
            marginRight: theme.spacing.unit / 2,
        },
        '& button': {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});

export default styles;
