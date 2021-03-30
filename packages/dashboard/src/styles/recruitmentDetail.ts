import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'max-content minmax(500px, 1fr)',
        margin: spacing(2),
    },
    timelineContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    tabsContainer: {},
}));

export default useStyles;
