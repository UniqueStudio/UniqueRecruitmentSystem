import { EmotionCache } from '@emotion/utils';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, StaticRouterProps } from 'react-router-dom';

import { App } from './App';

interface Props extends StaticRouterProps {
    cache: EmotionCache;
}

export const render = ({ location, context, cache }: Props) => renderToString(
    <StaticRouter location={location} context={context}>
        <App cache={cache} />
    </StaticRouter>,
);
