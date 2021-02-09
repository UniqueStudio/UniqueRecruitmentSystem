import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from 'layout';
import { ThemeProvider } from '@material-ui/core';
import theme from 'styles/theme';

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
      </ThemeProvider>
    </>
  );
}

export default MyApp;
