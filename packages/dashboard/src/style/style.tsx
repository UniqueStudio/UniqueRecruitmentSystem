import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core";
import { green, yellow, red, grey } from "@material-ui/core/colors";
// import { grey900 } from "material-ui/styles/colors";

const drawerWidth = 240;

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
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
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 2,
        overflowX: 'auto',
        height: 'calc(100vh - 64px)',
        marginTop: '64px'
    },
    columnContainer: {
        display: "flex",
        minHeight: "calc(100% - 64px)",
    },
    column: {
        margin: `0 ${theme.spacing.unit}px`,
        padding: theme.spacing.unit,
        paddingBottom: theme.spacing.unit * 4,
        position: 'relative',
    },
    columnTitle: {
        textAlign: "center",
        margin: theme.spacing.unit,
    },
    columnBody: {
        height: 'calc(100% - 40px)',
        marginBottom: theme.spacing.unit,
        width: 320
    },
    columnBottom: {
        margin: theme.spacing.unit,
        display: 'flex',
    },
    columnButton: {
        flex: '1',
    },
    card: {
        margin: theme.spacing.unit,
    },
    cornerChecker: {
        position: 'absolute',
        top: -theme.spacing.unit * 2,
        left: -theme.spacing.unit * 2,
    },
    iconButton: {
        marginLeft: 'auto',
    },
    chip: {
        margin: theme.spacing.unit,
    },
    comment: {
        width: '50%',
        margin: theme.spacing.unit,
    },
    cardDetail: {
        display: 'block',
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
    },
    greyCardWithBorder: {
        backgroundColor: grey["50"],
        border: `1px solid ${grey["200"]}`
    },
    whiteCardWithBorder: {
        backgroundColor: 'white',
        border: `1px solid ${grey["100"]}`
    }
});

export default styles;
