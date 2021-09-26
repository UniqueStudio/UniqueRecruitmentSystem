import { CacheProvider, EmotionCache } from '@emotion/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ThemeProvider, useMediaQuery } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { MainLayout } from '@layouts/MainLayout';
import store from '@stores/index';
import { useTheme } from '@uniqs/ui';
import { defaultLocale, dynamicActivate } from '@utils/i18n';

const pages = import.meta.globEager('./pages/*.tsx');

const routes = Object.entries<Record<string, FC>>(pages).map(([path, exports]) => {
    const filename = path.slice(path.lastIndexOf('/') + 1);
    const name = filename.slice(0, filename.lastIndexOf('.')).toLowerCase();
    return {
        name,
        path: `/${name === 'index' ? '' : name}`,
        Component: exports.default,
    };
});

interface Props {
    cache: EmotionCache;
}

export const App: FC<Props> = ({ cache }) => {
    const theme = useTheme(useMediaQuery('(prefers-color-scheme: dark)'));
    useAsyncEffect(() => dynamicActivate(defaultLocale()), []); // TODO: detect locale on server-side
    return (
        <CacheProvider value={cache}>
            <I18nProvider i18n={i18n}>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <MainLayout>
                            <Switch>
                                {routes.map(({ path, Component }) => (
                                    <Route key={path} path={path} exact={path === '/'}>
                                        <Component />
                                    </Route>
                                ))}
                            </Switch>
                        </MainLayout>
                    </ThemeProvider>
                </Provider>
            </I18nProvider>
        </CacheProvider>
    );
};
