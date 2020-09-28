import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ zIndex }: Theme) =>
    createStyles({
        imageLayer: {
            maxHeight: '100%',
        },
        image: {
            '&:hover': {
                cursor: 'pointer',
            },
            maxWidth: '100%',
        },
        imageRoot: {
            zIndex: zIndex.snackbar * 4,
        },
    }),
);

export default useStyles;
