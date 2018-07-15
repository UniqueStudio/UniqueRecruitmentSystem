import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    chart: {
        display: 'inline-flex',
        margin: theme.spacing.unit,
        width: 300,
        height: 300,
        verticalAlign: 'top'
    },
    newButton: {
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    newButtonRoot: {
        height: 'auto',
        width: 'auto',
    },
    newIcon: {
        fontSize: 144
    },
    tooltip: {
        fontSize: theme.typography.button.fontSize
    },
    newContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `0 ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`
    }
});

export default styles;