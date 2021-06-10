const { readFile } = require('fs/promises');
const express = require('express');
const { renderer } = require('./renderer');

const { render } = require('../dist/server/server.js');

express()
    .use(express.static('dist/client', { index: false }))
    .use('*', async ({ originalUrl: location }, res) => {
        try {
            res.send(renderer(await readFile('dist/client/index.html', 'utf-8'), (cache) => render({ location, cache })));
        } catch (e) {
            console.log(e);
            res.status(500).send(e.stack);
        }
    })
    .listen(4000, () => console.log('http://localhost:4000'));
