import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    infoContainer: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%'
    },
    table: {
        margin: theme.spacing.unit
    }
});

export default styles;