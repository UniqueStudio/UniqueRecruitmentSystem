const { readFile } = require('fs/promises');
const express = require('express');
const { createServer } = require('vite');
const { renderer } = require('./renderer');

createServer({ server: { middlewareMode: 'ssr' } }).then(({ middlewares, transformIndexHtml, ssrLoadModule }) => {
    express()
        .use(middlewares)
        .use('*', async ({ originalUrl: location }, res) => {
            try {
                const html = await transformIndexHtml(location, await readFile('index.html', 'utf-8'));
                const { render } = await ssrLoadModule('src/server.tsx');
                res.send(renderer(html, (cache) => render({ location, cache })));
            } catch (e) {
                console.log(e);
                res.status(500).send(e.stack);
            }
        })
        .listen(4000, () => console.log('http://localhost:4000'));
});
