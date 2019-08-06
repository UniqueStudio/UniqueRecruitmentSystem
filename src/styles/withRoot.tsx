import React, { ComponentType } from 'react';

import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import CssBaseline from '@material-ui/core/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ThemeProvider from '@material-ui/styles/ThemeProvider/ThemeProvider';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: grey,
    }
});

// https://github.com/mui-org/material-ui/blob/master/examples/create-react-app-with-typescript/src/withRoot.tsx
function withRoot<T>(Component: ComponentType<T>) {
    return (props: T) => (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...props} />
        </ThemeProvider>
    );
}

export default withRoot;
