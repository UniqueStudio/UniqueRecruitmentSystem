import { createMuiTheme } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import type {} from '@material-ui/lab/themeAugmentation';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[700],
        },
    },
});

export default theme;
