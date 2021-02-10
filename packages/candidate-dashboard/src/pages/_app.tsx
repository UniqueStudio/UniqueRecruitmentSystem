import type { AppProps } from 'next/app';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core';

import Snackbar from 'components/Snackbar';
import theme from 'styles/theme';
import Layout from 'layout';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>联创团队招新选手dashboard</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Snackbar type={undefined} message={undefined} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
