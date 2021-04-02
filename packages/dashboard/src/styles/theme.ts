import { createMuiTheme, responsiveFontSizes, ThemeOptions } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useMemo } from 'react';

const darkTheme: ThemeOptions = {
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
                // eslint-disable-next-line max-len
                // ref: https://material-ui.com/customization/components/#use-rulename-to-reference-a-local-rule-within-the-same-style-sheet
                '&$checked': 'inherit',
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
    useMemo(() => responsiveFontSizes(createMuiTheme(darkMode ? darkTheme : defaultTheme)), [darkMode]);
