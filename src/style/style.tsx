import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core";
import { green, yellow, red } from "@material-ui/core/colors";

const drawerWidth = 240;

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        position: "relative",
        display: "flex",
        minHeight: "100%"
    },
    appBar: {
        position: 'fixed',
        zIndex: theme.zIndex.drawer + 1,
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
    hide: {
        display: "none"
    },
    drawerPaper: {
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        minHeight: '100%'
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
        float: "left",
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 9,
        [theme.breakpoints.up("sm")]: {
            paddingLeft: theme.spacing.unit * 11
        }
    },
    columnContainer: {
        display: "flex",
        minHeight: "calc(100% - 64px)"
    },
    column: {
        width: 300,
        margin: "0 8px",
        padding: theme.spacing.unit
    },
    columnTitle: {
        textAlign: "center",
        margin: theme.spacing.unit
    },
    card: {
        cursor: "pointer",
        margin: theme.spacing.unit
    },
    cardHeader: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    chip: {
        margin: theme.spacing.unit,
    },
    commentContainer: {
        padding: theme.spacing.unit,
        textAlign: 'center'
    },
    comment: {
        width: '50%'
    },
    good: {
        background: green.A400,
    },
    soso: {
        background: yellow.A700,
    },
    bad: {
        background: red.A700,
        color: 'white',
    }
});

export default styles;
