import express from 'express';
import { promisify } from 'util';
import redis from 'redis';
import multer from 'multer';
import fs from 'fs';
import { Server } from 'http';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import Index from './db/index';
import { scanHandler, loginHandler, infoGetter, infoChanger, messenger, groupGetter } from './utils/user';
import {
    candidateAdder, candidateSetter, candidateGetterAll, candidateGetterGroup, resumeGetter, formGetter,
    onMoveCandidate,
    onRemoveCandidate,
    onAddComment, onRemoveComment
} from './utils/candidate';
import { interviewSender, sender, userCodeSender, candidateCodeSender } from './utils/sms';
import { recruitmentGetterAll, recruitmentGetterOne, recruitmetnLauncher } from './utils/recruitment';

const app = express();
const server = new Server(app);
export const io = socket(server);
export const database = new Index();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const candidateInfo = req['body'];
        const parentDir = `/www/resumes/${candidateInfo.title}`;
        const childDir = `${parentDir}/${candidateInfo.group}`;
        if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir);
        if (!fs.existsSync(childDir)) fs.mkdirSync(childDir);
        cb(null, `${childDir}/`);
    },
    filename: (req, file, cb) => cb(null, `${req['body'].name} - ${file.originalname}`)
});
const upload = multer({ storage: storage, limits: { fileSize: 104857600 } });  // 100MB
export const redisClient = redis.createClient();
export const getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.on("error", err => {
    console.log("Redis Error: " + err);
});

app.use(bodyParser.json({
    limit: '1mb'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    console.log('requested ' + req.url);
    next();
});

/**
 * uid: user id
 * cid: candidate id
 */

// login
// app.post('/user', (req, res) => {
//     (async () => {
//         try {
//             const user = await database.query('users', { username: req.body.username });
//             let uid;
//             if (!user.length) {
//                 uid = await database.insert('users', { username: req.body.username });
//             } else {
//                 uid = user[0]['_id'];
//             }
//             const token = jwt.sign({ uid }, secret, {
//                 expiresIn: 86400
//             });
//             res.send({ uid, token, type: 'success' });
//         } catch (err) {
//             res.send({ message: err.message, type: 'warning' });
//         }
//     })()
// });

// login: get QR code
app.get('/user', loginHandler);

// login: scan QR code
app.get('/user/:key/status', scanHandler);

// get user info
app.get('/user/:uid', infoGetter);

// change user info
app.put('/user/:uid', infoChanger);

// get users in a group
app.get('/user/group/:group', groupGetter);

// add new candidate
app.post('/candidates', upload.single('resume'), candidateAdder);

// set interview time
app.put('/candidates/:cid', candidateSetter);

// get all candidates in the latest recruitment
app.get('/candidates', candidateGetterAll);

// get candidates in certain group in the latest recruitment
app.get('/candidates/:group', candidateGetterGroup);

// get all candidates in a certain recruitment
app.get('/candidates/recruitment/:title', candidateGetterAll);

// get candidates in a certain group in a certain recruitment
app.get('/candidates/:group/recruitment/:title', candidateGetterGroup);

// get resume of a candidate
app.get('/candidates/:cid/resume', resumeGetter);

/* TODO */
// send notification sms
app.post('/sms', sender);

// send sms after all interview time has been arranged
app.post('/sms/interview', interviewSender);

// request for verification code
app.get('/verification/user', userCodeSender);

app.get('/verification/candidate/:phone', candidateCodeSender);

// generate form
app.get('/form/:formId/:cid', formGetter);

// get all history recruitments
app.get('/recruitment', recruitmentGetterAll);

// get a certain recruitment
app.get('/recruitment/:title', recruitmentGetterOne);

// launch a new recruitment
app.post('/recruitment', recruitmetnLauncher);

io.on('connection', (socket) => {
    console.log('WebSocket connected');
    // move a candidate from step a to step b
    socket.on('moveCandidate', onMoveCandidate(socket));
    // delete a certain candidate
    socket.on('removeCandidate', onRemoveCandidate(socket));
    // comment on a certain candidate
    socket.on('addComment', onAddComment(socket));
    // delete comment on a certain candidate
    socket.on('removeComment', onRemoveComment(socket));
    // instant messenger
    socket.on('sendMessage', messenger(socket));
});

server.listen(5000);
