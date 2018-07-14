import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core";

export const warningColor = "#ff9800";
export const dangerColor = "#f44336";
export const successColor = "#4caf50";
export const infoColor = "#00acc1";

const drawerWidth = 240;

export const colorToAlpha = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || ['', '', ''];
    const r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const colorToShadow = (hex: string) => {
    return `0 12px 20px -10px ${colorToAlpha(hex, 0.28)}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${colorToAlpha(hex, 0.2)}`
};

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: `linear-gradient(60deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36
    },
    personButton: {
        marginLeft: 'auto',
    },
    hide: {
        display: "none"
    },
    drawerPaper: {
        position: 'sticky',
        top: 0,
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing.unit * 9
        }
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        backgroundColor: colorToAlpha(theme.palette.secondary.light, 0.2),
        padding: theme.spacing.unit * 3,
        overflowX: 'auto',
        height: 'calc(100vh - 64px)',
        marginTop: '64px'
    },
    columnContainer: {
        display: "flex",
        minHeight: "100%",
    },
    column: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        borderRadius: 6,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
    },
    columnHeader: {
        background: theme.palette.primary.light,
        borderRadius: 3,
        marginTop: -theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 5,
        marginRight: theme.spacing.unit * 5,
        marginBottom: theme.spacing.unit,
        boxShadow: colorToShadow(theme.palette.primary.light)
    },
    columnTitle: {
        color: theme.palette.secondary.contrastText,
        textAlign: 'center',
        margin: theme.spacing.unit
    },
    columnBody: {
        height: 'calc(100% - 40px)',
        marginBottom: theme.spacing.unit,
        width: 360,
        paddingTop: theme.spacing.unit,
    },
    columnBottom: {
        margin: theme.spacing.unit,
        display: 'flex',
    },
    columnButton: {
        flex: '1',
    },
    modalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        display: "flex",
        flexDirection: "column",
        position: 'absolute',
        borderRadius: 6,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit,
        outline: 'none',
        maxWidth: '75%'
    },
    modalContent: {
        display: 'flex',
        margin: theme.spacing.unit * 2,
    },
    card: {
        margin: theme.spacing.unit,
        position: 'relative',
        zIndex: theme.zIndex.drawer,
        cursor: 'pointer',
    },
    cardContent: {
        margin: theme.spacing.unit,
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center'
    },
    cardAction: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    cardDetail: {
        display: 'block',
    },
    popper: {
        pointerEvents: 'none'
    },
    popperRoot: {
        padding: theme.spacing.unit,
    },
    cornerChecker: {
        position: 'absolute',
        top: -theme.spacing.unit * 2,
        left: -theme.spacing.unit * 2,
    },
    iconButton: {
        marginLeft: 'auto',
    },
    leftButton: {
        transform: 'rotate(90deg)',
        alignSelf: 'center'
    },
    rightButton: {
        transform: 'rotate(-90deg)',
        alignSelf: 'center'
    },
    comment: {
        width: '50%',
        margin: theme.spacing.unit,
    },
    select: {
        marginLeft: theme.spacing.unit * 4,
        '& *': {
            color: 'white !important',
        },
        '&:before, &:after': {
            display: 'none',
        },
        '& *:focus': {
            background: 'none'
        }
    },
    progress: {
        width: '100%',
        position: 'fixed',
        zIndex: theme.zIndex.drawer + 1
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: theme.spacing.unit * 2,
        justifyContent: 'space-around',
    },
    detailRow: {
        display: 'flex',
        width: 400,
        '& *': {
            marginLeft: theme.spacing.unit / 2,
            marginRight: theme.spacing.unit / 2
        },
        '& button': {
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    comments: {
        width: 360
    },
    login: {
        height: 400,
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default styles;
