import React, { ComponentType } from 'react';

import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import CssBaseline from '@material-ui/core/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: grey,
    },
    typography: {
        useNextVariants: true,
    }
});

// https://github.com/mui-org/material-ui/blob/master/examples/create-react-app-with-typescript/src/withRoot.tsx
function withRoot<T>(Component: ComponentType<T>) {
    return (props: T) => (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...props} />
        </MuiThemeProvider>
    );
}

export default withRoot;
