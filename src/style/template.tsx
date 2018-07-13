import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
    template: {
        margin: theme.spacing.unit * 2,
        width: 800
    },
    templateContent: {
        minHeight: theme.spacing.unit * 3,
    },
    templateParams: {
        display: 'flex',
    },
    templateItem: {
        margin: theme.spacing.unit,
    },
    templateEnd: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default styles;