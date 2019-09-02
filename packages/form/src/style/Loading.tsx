import { createStyles } from '@material-ui/core/styles';

const styles = createStyles({
    root: {
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        color: 'rgb(31,84,122)'
    }
});

export default styles;
