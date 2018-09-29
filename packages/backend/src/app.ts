import express from 'express';
import { promisify } from 'util';
import redis from 'redis';
import multer from 'multer';
import fs from 'fs';
import https from 'https';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import Index from './db/index';
import { handleScan, handleLogin, getInfo, changeInfo, messenger, getGroup } from './utils/user';
import {
    addCandidate, setCandidate, getAllCandidates, getGroupCandidates, getResume, getForm,
    onMoveCandidate,
    onRemoveCandidate,
    onAddComment, onRemoveComment, getStepCandidates
} from './utils/candidate';
import { sendInterview, sendCommon, sendUserCode, sendCandidateCode } from './utils/sms';
import {
    getAllRecruitments,
    getOneRecruitment,
    launchRecruitment,
    setRecruitment,
    setSlots
} from './utils/recruitment';

const app = express();
const server = https.createServer({
    key: fs.readFileSync('/etc/pki/tls/private/uniqcert.key'),
    cert: fs.readFileSync('/etc/pki/tls/uniqcert.fullchain')
}, app);
export const io = socket(server);
export const database = new Index();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const candidateInfo = req['body'];
        const parentDir = `/www/resumes/${candidateInfo.title}`;
        const childDir = `${parentDir}/${candidateInfo.group}`;
        if (!fs.existsSync('/www')) fs.mkdirSync('/www');
        if (!fs.existsSync('/www/resumes')) fs.mkdirSync('/www/resumes');
        if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir);
        if (!fs.existsSync(childDir)) fs.mkdirSync(childDir);
        cb(null, `${childDir}/`);
    },
    filename: (req, file, cb) => cb(null, `${req['body'].name} - ${file.originalname}`)
});
const upload = multer({ storage: storage, limits: { fileSize: 104857600 } });  // 100MB
export const redisClient = redis.createClient({
    host: 'redis'
});
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
app.get('/user', handleLogin);

// login: scan QR code
app.get('/user/:key/status', handleScan);

// get user info
app.get('/user/:uid', getInfo);

// change user info
app.put('/user/:uid', changeInfo);

// get users in a group
app.get('/user/group/:group', getGroup);

// add new candidate
app.post('/candidates', upload.single('resume'), addCandidate);

// set candidates data
app.put('/candidates/:cid', setCandidate);

// get all candidates in the latest recruitment
app.get('/candidates', getAllCandidates);

// get candidates in a certain group in the latest recruitment
app.get('/candidates/group/:group', getGroupCandidates);

// get candidates in a certain step in the latest recruitment
app.get('/candidates/step/:step', getStepCandidates);

// get all candidates in a certain recruitment
app.get('/candidates/recruitment/:title', getAllCandidates);

// get candidates in a certain group in a certain recruitment
app.get('/candidates/group/:group/recruitment/:title', getGroupCandidates);

// get candidates in a certain step in a certain recruitment
app.get('/candidates/step/:step/recruitment/:title', getStepCandidates);

// get resume of a candidate
app.get('/candidates/:cid/resume', getResume);

/* TODO */
// send notification sms
app.post('/sms', sendCommon);

// send sms after all interview time has been arranged
app.post('/sms/interview', sendInterview);

// request for verification code
app.get('/verification/user', sendUserCode);

app.get('/verification/candidate/:phone', sendCandidateCode);

// generate form
app.get('/form/:formId/:cid', getForm);

// get all history recruitments
app.get('/recruitment', getAllRecruitments);

// get a certain recruitment
app.get('/recruitment/:title', getOneRecruitment);

// launch a new recruitment
app.post('/recruitment', launchRecruitment);

// set recruitment
app.post('/recruitment/:title', setRecruitment);

// set time slots
app.post('/recruitment/:title/slots', setSlots);

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
