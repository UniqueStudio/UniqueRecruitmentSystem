import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
  }

  render() {
    return (
      <Html>
        <Head lang='zh-CN'>
          <meta charSet='utf-8' />
          <meta httpEquiv='Content-Language' content='zh-CN' />
          <meta httpEquiv='X-UA-Compatible' content='IE=Edge,chrome=1' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='keywords' content='Unique Studio' />
          <meta name='description' content='Unique Recruitment Form' />
          <meta name='description' content='联创团队是华中科技大学由学生自发组织自主实践自行运营的互联网团队' />
          <meta
            name='description'
            content='联创团队网站提供了团队的所有基本信息，包括团队简介，团队作品，团队招新和联系方式'
          />
          <link rel='manifest' href='/manifest.json' />
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='stylesheet' href='https://unpkg.com/normalize.css@8.0.1/normalize.css' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
