import React, { ComponentType, createContext, useEffect, useState } from 'react';

import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface ContextProps {
    darkMode: boolean;
    setDarkMode: () => void;
}

export const ThemeContext = createContext<ContextProps>({
    darkMode: false,
    setDarkMode: () => undefined,
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#343434',
            dark: '#000000',
            light: '#484848',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff7597',
        },
        background: {
            default: '#121212',
        },
    },
    overrides: {
        MuiIconButton: {
            colorPrimary: {
                color: 'white',
            },
        },
        MuiButton: {
            textPrimary: {
                color: 'white',
            },
        },
        MuiCheckbox: {
            colorPrimary: {
                // override the checked checkbox styles
                // ref: https://material-ui.com/customization/components/#use-rulename-to-reference-a-local-rule-within-the-same-style-sheet
                '&$checked': 'inherit',
            },
        },
    },
});

const defaultTheme = createMuiTheme({
    palette: {
        primary: blue,
        background: {
            default: '#f1f1f1',
        },
    },
});

// https://github.com/mui-org/material-ui/blob/master/examples/create-react-app-with-typescript/src/withRoot.tsx
function withRoot<T>(Component: ComponentType<T>) {
    return (props: T) => {
        const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
        const [darkMode, setDarkMode] = useState(false);

        // using a stand alone `useEffect()` because I would like to
        // switch theme mode automaticly when system setting change (e.g. useMediaQuery returns)
        useEffect(() => {
            setDarkMode(prefersDarkMode);
        }, [prefersDarkMode]);

        return (
            <ThemeContext.Provider value={{ darkMode, setDarkMode: () => setDarkMode(!darkMode) }}>
                <ThemeProvider theme={darkMode ? darkTheme : defaultTheme}>
                    <CssBaseline />
                    <Component {...props} />
                </ThemeProvider>
            </ThemeContext.Provider>
        );
    };
}

export default withRoot;
