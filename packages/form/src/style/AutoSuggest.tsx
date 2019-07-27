import { createStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            position: 'relative'
        },
        input: {},
        menuItem: {},
        menu: {
            position: 'absolute',
            overflowY: 'auto',
            height: '30vh'
        }
    });

export default styles;
