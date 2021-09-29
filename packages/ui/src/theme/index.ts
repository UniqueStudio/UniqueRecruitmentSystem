import { createTheme, responsiveFontSizes } from '@mui/material';
import { blue, grey, pink } from '@mui/material/colors';
import { useMemo } from 'react';

export const useTheme = (darkMode: boolean) =>
    useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    palette: {
                        mode: darkMode ? 'dark' : 'light',
                        primary: {
                            main: blue[darkMode ? 800 : 500],
                        },
                        secondary: {
                            main: pink[darkMode ? 700 : 300],
                        },
                        background: darkMode ? {} : { default: grey[100] },
                    },
                }),
            ),
        [darkMode],
    );
