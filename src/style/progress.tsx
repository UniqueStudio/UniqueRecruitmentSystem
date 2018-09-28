import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    progress: {
        position: 'fixed',
        zIndex: theme.zIndex.modal + 1,
        top: 0,
        left: 0,
        width: '100%',
    },
});

export default styles;