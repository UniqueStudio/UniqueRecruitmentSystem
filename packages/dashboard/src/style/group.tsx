import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    container: {
        display: 'flex',
        height: '100%',
    },
    messenger: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.unit,
    },
    messages: {
        flex: '1',
        overflowY: 'auto',
        padding: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    messageContainer: {
        display: 'flex',
        margin: `${theme.spacing.unit}px 0`
    },
    input: {
        marginTop: 'auto'
    },
    inputContent: {
        display: 'flex',
        alignItems: 'flex-end'
    },
    textField: {
        width: '100%'
    },
    chipRoot: {
        height: 'auto',
        padding: theme.spacing.unit,
        whiteSpace: 'normal',
        '& > *': {
            whiteSpace: 'normal'
        }
    },
    messageContent: {
        wordWrap: 'break-word',
        maxWidth: 200
    },
    avatar: {
        margin: theme.spacing.unit
    },
    my: {
        direction: 'rtl'
    },
    message: {
        display: 'flex',
        flexDirection: 'column',
    },
    hidden: {
        display: 'none'
    }
});

export default styles;