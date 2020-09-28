import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        content: {
            flexGrow: 1,
            marginTop: spacing(8),
            height: 'calc(100vh - 64px)',
            overflowX: 'auto',
            [breakpoints.down('xs')]: {
                marginTop: spacing(6),
                height: 'calc(100vh - 48px)',
            },
        },
    }),
);

export default useStyles;
