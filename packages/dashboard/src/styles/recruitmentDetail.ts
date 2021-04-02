import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'max-content minmax(500px, 1fr)',
    },
    timelineContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

export default useStyles;
