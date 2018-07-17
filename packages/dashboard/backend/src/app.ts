import express from 'express';
import { Server } from 'http';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import Database from './database';

const app = express();
const server = new Server(app);
const io = socket(server);
const database = new Database();

app.use(bodyParser.json({
    limit: '1mb'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    console.log('requested ' + req.url);
    next();
});

/**
 * uid: user id
 * cid: candidate id
 */

// login
app.post('/user', (req, res) => {

});

// change user info
app.put('/user/:uid', (req, res) => {

});

// get all candidates
app.get('/candidates', (req, res) => {
    database
        .query('candidates', {})
        .then(data => res.send(data));
});

// get candidates in certain group
app.get('/candidates/:group', (req, res) => {
    database
        .query('candidates', { group: req.params.group })
        .then(data => res.send(data));
});

// move a candidate from step a to step b
app.put('/candidates/:cid', (req, res) => {
    database
        .update('candidates', req.params.cid, { step: req.body.to })
        .then(() => res.send({ info: 'success' }));
    io.emit('moveCandidate', req.params.cid, req.body.from, req.body.to);
});

// delete a certain candidate
app.delete('/candidates/:cid', (req, res) => {
    database
        .delete('candidates', req.params.cid)
        .then(() => res.send({ info: 'success' }));
    io.emit('removeCandidate', req.params.cid);
});

// comment on a certain candidate
app.post('/candidates/:cid/comments', (req, res) => {
    database
        .update('candidates', req.params.cid, { ['comments.' + req.body.uid]: req.body.comment })
        .then(() => res.send({ info: 'success' }));
    io.emit('addComment', req.body.step, req.params.cid, req.body.uid, req.body.comment);
});

// delete comment on a certain candidate
app.delete('/candidates/:cid/comments/:uid', (req, res) => {
    database
        .update('candidates', req.params.cid, { [`comments.${req.params.uid}`]: '' }, true)
        .then(() => res.send({ info: 'success' }));
    io.emit('removeComment', req.body.step, req.params.cid, req.params.uid);
});

// send sms
app.post('/sms', (req, res) => {

});

// request for verification code
app.post('/verification', (req, res) => {

});

// get all history recruitments
app.get('/recruitment', (req, res) => {

});

// get a certain recruitment
app.get('/recruitment/:title', (req, res) => {

});

// launch a new recruitment
app.post('/recruitment', (req, res) => {

});


io.on('connection', socket => {
    console.log('WebSocket connected');
});

server.listen(5000);
