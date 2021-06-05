import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CustomTheme from './theme';

const {
    palette: { primary },
} = CustomTheme;

const styles = ({ breakpoints }: Theme) =>
    createStyles({
        root: {
            width: '80%',
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            [breakpoints.down('xs')]: {
                position: 'fixed',
                backgroundColor: 'rgba(0,0,0,0.5)',
            },
        },
        barColorPrimary: {
            backgroundColor: primary.main,
        },
        colorPrimary: {
            backgroundColor: primary.light,
        },
    });

export default makeStyles(styles);
