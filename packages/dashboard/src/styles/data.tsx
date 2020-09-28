import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) =>
    createStyles({
        container: {
            minWidth: 300,
            marginTop: spacing(3),
            padding: `0 ${spacing(3)}px`,
            [breakpoints.up('md')]: {
                display: 'flex',
                justifyContent: 'space-around',
                minWidth: 0,
            },
            [breakpoints.down('md')]: {
                padding: `0 ${spacing(2)}px`,
                width: '100%',
            },
            [breakpoints.down('xs')]: {
                padding: `0 ${spacing(1)}px`,
            },
        },
        recruitmentContainer: {
            margin: spacing(2),
            flex: '1 1 0',
            [breakpoints.down('sm')]: {
                margin: `${spacing(2)}px 0`,
            },
        },
        paper: {
            margin: `${spacing(2)}px 0`,
            padding: spacing(2),
            height: '100%',
            width: '50%',
            [breakpoints.down('sm')]: {
                margin: `${spacing(2)}px ${spacing(1)}px`,
                padding: spacing(1),
                width: 'auto',
                flex: '1 1 0',
            },
        },
        data: {
            display: 'flex',
            flexDirection: 'column',
        },
        textFieldContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-around',
            maxWidth: 600,
            [breakpoints.down('xs')]: {
                display: 'block',
                padding: `0 ${spacing(1)}px`,
            },
        },
        textField: {
            width: 50,
            margin: spacing(1),
            [breakpoints.down('xs')]: {
                width: 36,
                margin: spacing(0.5),
            },
        },
        expansion: {
            margin: `${spacing(1)}px !important`,
        },
        expansionDetails: {
            padding: `0 ${spacing(3)}px`,
            [breakpoints.down('xs')]: {
                padding: `0 ${spacing(1.5)}px`,
            },
        },
        expansionActions: {
            padding: `0 ${spacing(2)}px`,
        },
        dates: {
            flexDirection: 'row',
        },
        datePicker: {
            margin: spacing(1),
            width: 150,
            [breakpoints.down('lg')]: {
                width: 120,
            },
            [breakpoints.down('md')]: {
                width: 80,
            },
            [breakpoints.down('xs')]: {
                margin: spacing(0.5),
            },
        },
        dateSelection: {
            margin: spacing(1),
            width: 150,
            [breakpoints.down('xs')]: {
                margin: spacing(0.5),
            },
        },
        buttonContainer: {
            display: 'inline-flex',
            margin: spacing(1),
            [breakpoints.down('md')]: {
                margin: spacing(0.5),
            },
            '& button': {
                margin: spacing(1),
                [breakpoints.down('md')]: {
                    margin: spacing(0.5),
                },
            },
        },
        tableButtons: {
            display: 'inline-block',
            marginLeft: 'auto',
        },
        tableContainer: {
            overflowX: 'auto',
        },
        table: {
            marginBottom: spacing(1),
            minWidth: 350,
        },
        tableCell: {
            padding: spacing(1),
            textAlign: 'center',
            [breakpoints.down('xs')]: {
                padding: spacing(0.5),
                width: spacing(7),
            },
        },
        title: {
            display: 'flex',
            justifyContent: 'space-around',
        },
        dialog: {
            margin: spacing(2),
            [breakpoints.down('xs')]: {
                margin: spacing(1),
            },
            display: 'flex',
            alignItems: 'baseline',
        },
    }),
);

export default useStyles;
