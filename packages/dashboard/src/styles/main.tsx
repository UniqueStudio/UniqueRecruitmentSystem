import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/styles';

import { colorToAlpha } from './index';

const styles = ({ palette, spacing, breakpoints }: Theme) => createStyles({
    '@global': {
        '::-webkit-scrollbar': {
            width: 3,
            height: 12,
        },
        '::-webkit-scrollbar-thumb': {
            background: '#aaa',
            borderRadius: 1,
        }
    },
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        backgroundColor: colorToAlpha(palette.secondary.light, 0.2),
        marginTop: spacing(8),
        height: 'calc(100vh - 64px)',
        overflowX: 'auto',
        [breakpoints.down('xs')]: {
            marginTop: spacing(6),
            height: 'calc(100vh - 48px)',
        },
    },
});

export default styles;
