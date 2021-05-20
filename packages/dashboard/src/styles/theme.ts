import { createTheme, responsiveFontSizes, ThemeOptions } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useMemo } from 'react';

const darkTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
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
    components: {
        MuiIconButton: {
            styleOverrides: {
                colorPrimary: {
                    color: 'white',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                textPrimary: {
                    color: 'white',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                colorPrimary: {
                    // override the checked checkbox styles
                    // eslint-disable-next-line max-len
                    // ref: https://material-ui.com/customization/components/#use-rulename-to-reference-a-local-rule-within-the-same-style-sheet
                    '&$checked': 'inherit',
                },
            },
        },
    },
};

const defaultTheme: ThemeOptions = {
    palette: {
        primary: blue,
        background: {
            default: '#f1f1f1',
        },
    },
};

export const useTheme = (darkMode: boolean) =>
    useMemo(() => responsiveFontSizes(createTheme(darkMode ? darkTheme : defaultTheme)), [darkMode]);
