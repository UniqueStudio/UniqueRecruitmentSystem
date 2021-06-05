import { createStyles, makeStyles } from '@material-ui/core/styles';

interface Props {
    open: boolean;
}

const styles = createStyles({
    root: ({ open }: Props) => ({
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: open ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
    }),
    loading: {
        color: 'rgb(31,84,122)',
    },
});

export default makeStyles(styles);
