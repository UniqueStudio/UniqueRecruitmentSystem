const createCache = require('@emotion/cache').default;
const createEmotionServer = require('@emotion/server/create-instance').default;

exports.renderer = (html, render) => {
    const cache = createCache({ key: 'css' });
    cache.compat = true;
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
    const body = render(cache);
    const style = constructStyleTagsFromChunks(extractCriticalToChunks(body));
    return html.replace('<!--SSR_BODY-->', body).replace('<!--SSR_STYLE-->', style);
}
