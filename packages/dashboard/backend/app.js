const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const candidates = require('./candidates');

app.use(bodyParser.json({limit: '1mb'}));

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
    res.send(candidates);
});

// get candidates in certain group
app.get('/candidates/:group', (req, res) => {
    res.send(candidates[req.params.group]);
});

// move a candidate from step a to step b
app.put('/candidates/:cid', (req, res) => {

});

// delete a certain candidate
app.delete('/candidates/:cid', (req, res) => {

});

// comment on a certain candidate
app.post('/candidates/:cid/comments', (req, res) => {

});

// update comment on a certain candidate
app.put('/candidates/:cid/comments/:uid', (req, res) => {

});

// delete comment on a certain candidate
app.delete('/candidates/:cid/comments/:uid', (req, res) => {

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

app.listen(5000);
