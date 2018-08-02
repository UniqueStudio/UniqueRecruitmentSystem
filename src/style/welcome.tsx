import { StyleRulesCallback } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles";

const styles: StyleRulesCallback = (theme: Theme) => ({
    indexImage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    logoImage: {
        width: '50%',
        minWidth: 300
    },
    welcomeImage: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
        width: '100%'
    },
});

export default styles;