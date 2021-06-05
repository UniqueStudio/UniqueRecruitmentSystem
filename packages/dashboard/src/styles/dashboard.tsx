import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) =>
    createStyles({
        left: {
            width: '70%',
            margin: spacing(1),
            [breakpoints.down('xs')]: {
                paddingTop: spacing(2),
                width: '100%',
                margin: 0,
            },
        },
        right: {
            flexGrow: 1,
            margin: spacing(1),
            [breakpoints.down('xs')]: {
                paddingTop: spacing(2),
                margin: 0,
            },
        },
        root: {
            display: 'flex',
            flexDirection: 'row',
            [breakpoints.down('xs')]: {
                flexDirection: 'column',
                margin: spacing(1),
            },
            margin: `${spacing(3)}px ${spacing(2)}px 0`,
            minWidth: 300,
        },
        blocksContainer: {
            marginTop: spacing(1),
            display: 'flex',
            flexWrap: "wrap",
            [breakpoints.down('xs')]: {
                flexDirection: 'column',
                alignItems: 'center',
            },
        },
        block: {
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            verticalAlign: 'bottom',
        },
        paper: {
            margin: spacing(2),
            padding: spacing(2),
            minHeight: 300,
            minWidth: 300,
            [breakpoints.down('xs')]: {
                width: '90%',
                margin: `${spacing(1)}px auto`,
                padding: spacing(1),
            },
        },
        title: {
            userSelect: 'none',
            marginLeft: spacing(1),
        },
    }),
);

export default useStyles;
