import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core";

export const warningColor = "#ff9800";
export const dangerColor = "#f44336";
export const successColor = "#4caf50";
export const infoColor = "#00acc1";

const drawerWidth = 240;

export const colortToAlpha = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || ['', '', ''];
    const r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const colorToShadow = (hex: string) => {
    return `0 12px 20px -10px ${colortToAlpha(hex, 0.28)}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${colortToAlpha(hex, 0.2)}`
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
        backgroundColor: colortToAlpha(theme.palette.secondary.light, 0.2),
        padding: theme.spacing.unit * 3,
        overflowX: 'auto',
        height: 'calc(100vh - 64px)',
        marginTop: '64px'
    },
    columnContainer: {
        display: "flex",
        minHeight: "calc(100% - 64px)",
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
        width: 360
    },
    columnBottom: {
        margin: theme.spacing.unit,
        display: 'flex',
    },
    columnButton: {
        flex: '1',
    },
    modal: {
        display: "flex",
        flexDirection: "column",
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 2,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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
    cardAction: {
        justifyContent: 'center',
    },
    cardDetail: {
        display: 'block',
    },
    success: {
        background: successColor,
        color: theme.palette.secondary.contrastText,
        boxShadow: colorToShadow(successColor)
    },
    warning: {
        background: warningColor,
        color: theme.palette.secondary.contrastText,
        boxShadow: colorToShadow(warningColor)
    },
    danger: {
        background: dangerColor,
        color: theme.palette.secondary.contrastText,
        boxShadow: colorToShadow(dangerColor)
    },
    info: {
        background: infoColor,
        color: theme.palette.secondary.contrastText,
        boxShadow: colorToShadow(infoColor)
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
    }
});

export default styles;
