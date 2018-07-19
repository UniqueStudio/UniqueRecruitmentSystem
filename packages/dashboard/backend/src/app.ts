import express from 'express';
import { Server } from 'http';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import Database from './database';
import { ObjectId } from 'mongodb';
import { Candidate } from './type';

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

// login temp TODO
app.post('/user', (req, res) => {
    try {
        (async () => {
            const user = await database.query('users', { username: req.body.username });
            let uid;
            if (!user.length) {
                uid = await database.insert('users', { username: req.body.username });
            } else {
                uid = user[0]['_id'];
            }
            res.send({ uid, type: 'success' });
        })()
    } catch (err) {
        res.send({ message: err.message, type: 'warning' });
    }
});

// get user info
app.get('/user/:uid', (req, res) => {
    database
        .query('users', { '_id': new ObjectId(req.params.uid) })
        .then(data => res.send({ ...data, type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
});

// change user info
app.put('/user/:uid', (req, res) => {
    const body = req.body;
    database
        .update('users', req.params.uid, {
            joinTime: body.joinTime,
            isCaptain: Boolean(body.isCaptain),
            isAdmin: Boolean(body.isAdmin),
            phone: body.phone,
            mail: body.mail,
            sex: body.sex,
            group: body.group,
        })
        .then(() => res.send({ type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
});

// add new candidate
app.post('/candidates', (req, res) => {
    const body = req.body;
    database
        .insert('candidates', {
            name: body.name,
            grade: body.grade,
            institute: body.institute,
            major: body.major,
            score: body.score,
            mail: body.mail,
            phone: body.phone,
            group: body.group,
            sex: body.sex,
            step: 0,
            intro: body.intro,
            comments: {}
            // resume: body.resume
        })
        .then(() => res.send({ type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
});

// update new info / set interview time
app.put('/candidates/:cid', (req, res) => {
    database
        .update('candidates', req.params.cid, req.body.patch)
        .then(() => res.send({ type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
});

// get all candidates
app.get('/candidates', (req, res) => {
    database
        .query('candidates', {})
        .then(data => {
            const formatted = [{}, {}, {}, {}, {}, {}];
            data.map((i: Candidate) => formatted[i.step][`${i._id}`] = i);
            res.send({ ...formatted, type: 'success' });
        })
        .catch(err => res.send({ message: err.message, type: 'warning' }));
});

// get candidates in certain group
app.get('/candidates/:group', (req, res) => {
    database
        .query('candidates', { group: req.params.group })
        .then(data => {
            const formatted = [{}, {}, {}, {}, {}, {}];
            data.map((i: Candidate) => formatted[i.step][`${i._id}`] = i);
            res.send({ ...formatted, type: 'success' })
        })
        .catch(err => res.send({ message: err.message, type: 'warning' }));
});

// move a candidate from step a to step b
app.put('/candidates/:cid/step/:to', (req, res) => {
    database
        .query('candidates', { '_id': new ObjectId(req.params.cid), step: req.body.from })
        .then(data => {
            if (data.length) {
                database
                    .update('candidates', req.params.cid, { step: req.params.to })
                    .then(() => res.send({ type: 'success' }))
                    .then(() => io.emit('moveCandidate', req.params.cid, req.body.from, req.params.to))
                    .catch(err => res.send({ message: err.message, type: 'danger' }))
            } else {
                res.send({ message: 'candidate has already been moved', type: 'warning' });
            }
        })
        .catch(err => res.send({ message: err.message, type: 'danger' }))
});

// delete a certain candidate
app.delete('/candidates/:cid', (req, res) => {
    database
        .delete('candidates', req.params.cid)
        .then(() => res.send({ type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
    io.emit('removeCandidate', req.params.cid);
});

// comment on a certain candidate
app.post('/candidates/:cid/comments', (req, res) => {
    database
        .update('candidates', req.params.cid, { ['comments.' + req.body.uid]: req.body.comment })
        .then(() => res.send({ type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
    io.emit('addComment', req.body.step, req.params.cid, req.body.uid, req.body.comment);
});

// delete comment on a certain candidate
app.delete('/candidates/:cid/comments/:uid', (req, res) => {
    database
        .update('candidates', req.params.cid, { [`comments.${req.params.uid}`]: '' }, true)
        .then(() => res.send({ type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
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
    database
        .query('recruitments', {})
        .then(data => res.send({ ...data, type: 'success' }));
});

// get a certain recruitment
app.get('/recruitment/:title', (req, res) => {
    database
        .query('recruitments', { title: req.params.title })
        .then(data => res.send({ ...data, type: 'success' }));
});

// launch a new recruitment
app.post('/recruitment', (req, res) => {
    database
        .insert('recruitments', {
            title: req.body.title,
            begin: req.body.begin,
            end: req.body.end,
        })
        .then(() => res.send({ type: 'success' }))
});


io.on('connection', () => {
    console.log('WebSocket connected');
});

server.listen(5000);
