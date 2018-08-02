import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { colorToAlpha } from './index';
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        display: "flex",
    },
    content: {
        flexGrow: 1,
        backgroundColor: colorToAlpha(theme.palette.secondary.light, 0.2),
        padding: theme.spacing.unit * 3,
        overflowX: 'auto',
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing.unit * 7,
            height: 'calc(100vh - 56px)',
            padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
        },
        marginTop: theme.spacing.unit * 8,
        height: 'calc(100vh - 64px)',
    },
});

export default styles;