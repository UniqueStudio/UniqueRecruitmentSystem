import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() =>
    createStyles({
        '@global': {
            '::-webkit-scrollbar': {
                width: 3,
                height: 12,
            },
            '::-webkit-scrollbar-thumb': {
                background: '#aaa',
                borderRadius: 1,
            },
            '*': {
                '-webkit-tap-highlight-color': 'transparent', // fuck chrome
            },
        },
    }),
);

export default useStyles;
