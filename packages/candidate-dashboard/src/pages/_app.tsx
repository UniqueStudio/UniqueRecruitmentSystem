import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { FC } from 'react';

import Snackbar from 'components/Snackbar';
import theme from 'styles/theme';
import Layout from 'layout';

import store, { useAppDispatch, useAppSelector } from 'store';
import { resetSnackbar } from 'store/component';

import '../styles/globals.css';

// Todo: make without layout filter implementation more Elegant.
const withoutLayout: Set<string> = new Set(['/login', '/_error']);

const SnackbarWapper: FC = () => {
    const snackbarProps = useAppSelector((state) => state.component.snackbar);
    const dispatch = useAppDispatch();
    return <Snackbar {...snackbarProps} onClose={() => dispatch(resetSnackbar())} />;
};

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>联创团队招新选手Dashboard</title>
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            </Head>
            <CssBaseline />
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    {withoutLayout.has(router.pathname) ? (
                        <Component {...pageProps} />
                    ) : (
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    )}
                    <SnackbarWapper />
                </ThemeProvider>
            </Provider>
        </>
    );
}

export default MyApp;
