import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { Server } from 'http';
import socket, { Socket } from 'socket.io';
import bodyParser from 'body-parser';
import Database from './database';
import { ObjectId } from 'mongodb';
import { GROUPS as groups, Candidate } from './consts';

const app = express();
const server = new Server(app);
const io = socket(server);
const database = new Database();
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
const upload = multer({ storage: storage, limits: { fileSize: 104857600 } });


const checkMail = (mail: string) => {
    const re = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(mail);
};

const checkPhone = (phone: string) => {
    const re = /^((13[0-9])|(14[57])|(15[0-3,5-9])|166|(17[035678])|(18[0-9])|(19[89]))\d{8}$/i;
    return re.test(phone);
};

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
    (async () => {
        try {
            const user = await database.query('users', { username: req.body.username });
            let uid;
            if (!user.length) {
                uid = await database.insert('users', { username: req.body.username });
            } else {
                uid = user[0]['_id'];
            }
            res.send({ uid, type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'warning' });
        }
    })()
});

// get user info
app.get('/user/:uid', (req, res) => {
    database
        .query('users', { _id: new ObjectId(req.params.uid) })
        .then(data => res.send({ data: data[0], type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'warning' }));
});

// change user info
app.put('/user/:uid', (req, res) => {
    const body = req.body;
    (async () => {
        try {
            if (Object.values(body).includes('')) {
                res.send({ message: '请完整填写信息!', type: 'warning' });
                return;
            }
            if (!checkMail(body.mail)) {
                res.send({ message: '邮箱格式不正确!', type: 'warning' });
                return;
            }
            if (!checkPhone(body.phone)) {
                res.send({ message: '手机号码格式不正确!', type: 'warning' });
                return;
            }
            await database.update('users', { _id: new ObjectId(req.params.uid) }, {
                username: body.username,
                joinTime: body.joinTime,
                isCaptain: Boolean(body.isCaptain),
                isAdmin: Boolean(body.isAdmin),
                phone: body.phone,
                mail: body.mail,
                sex: body.sex,
                group: body.group,
            });
            res.send({ type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()

});

// add new candidate
app.post('/candidates', upload.single('resume'), (req, res) => {
    const body = req.body;
    (async () => {
        try {
            if (Object.values(body).includes('')) {
                res.send({ message: '请完整填写表单!', type: 'warning' });
                return;
            }
            if (!checkMail(body.mail)) {
                res.send({ message: '邮箱格式不正确!', type: 'warning' });
                return;
            }
            if (!checkPhone(body.phone)) {
                res.send({ message: '手机号码格式不正确!', type: 'warning' });
                return;
            }
            const cid = await database.insert('candidates', {
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
                title: body.title,
                comments: {},
                resume: `/www/resumes/${body.title}/${body.group}/${body.name} - ${req.file.originalname}`
            });
            const recruitment = (await database.query('recruitments', { title: body.title }))[0];
            if (!recruitment) {
                res.send({ message: '当前招新不存在!', type: 'warning' });
                return;
            }
            const data = recruitment['data'].map((i: object) => {
                if (i['group'] === body.group) {
                    if (i['total'] === undefined) i['total'] = 0;
                    i['total'] += 1;
                    if (!i['steps']) i['steps'] = [0, 0, 0, 0, 0, 0];
                    i['steps'][0] += 1;
                }
                return i;
            });
            await database.update('recruitments', { title: body.title }, {
                data,
                total: recruitment['total'] ? recruitment['total'] + 1 : 1
            });
            res.send({ type: 'success' });
            const candidateResult = await database.query('candidates', { _id: new ObjectId(cid) });
            io.emit('addCandidate', candidateResult[0]);
            io.emit('updateRecruitment');
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })()
});

// set interview time
app.put('/candidates/:cid', (req, res) => {
    database
        .update('candidates', { _id: new ObjectId(req.params.cid) }, req.body.patch)
        .then(() => res.send({ type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'danger' }));
});

// get all candidates
app.get('/candidates', (req, res) => {
    database
        .query('candidates', {})
        .then(data => {
            const formatted = [{}, {}, {}, {}, {}, {}];
            data.map((i: Candidate) => formatted[i.step][`${i._id}`] = { ...i, resume: '' }); // hide resume path
            res.send({ data: formatted, type: 'success' });
        })
        .catch(err => res.send({ message: err.message, type: 'danger' }));
});

// get candidates in certain group
app.get('/candidates/:group', (req, res) => {
    database
        .query('candidates', { group: req.params.group })
        .then(data => {
            const formatted = [{}, {}, {}, {}, {}, {}];
            data.map((i: Candidate) => formatted[i.step][`${i._id}`] = i);
            res.send({ data: formatted, type: 'success' })
        })
        .catch(err => res.send({ message: err.message, type: 'danger' }));
});

// get resume of a candidate
app.get('/candidates/:cid/resume', (req, res) => {
    database
        .query('candidates', { _id: new ObjectId(req.params.cid) })
        .then(data => {
            if (!data[0].resume) {
                res.status(404).send({ message: '简历不存在！', type: 'warning' });
            } else {
                const filename = Buffer.from(data[0].resume.replace(/^\/www\/resumes\/\w+\/\w+\//, '')).toString('base64');
                res.set({
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Access-Control-Expose-Headers': 'Content-Disposition',
                }).sendFile(data[0].resume);
            }
        })
        .catch(err => res.status(500).send({ message: err.message, type: 'danger' }));
});

/* TODO */
const verifyCode = (code: string) => true;
const sendSMS = (content: string) => {
};
// send sms
app.post('/sms', (req, res) => {
    const body = req.body;
    (async () => {
        try {
            const recruitment = (await database.query('recruitments', { title: body.title }))[0];
            let formId = '';
            if (body.date) {
                if (body.step === '笔试流程') {
                    formId = `${recruitment['_id']}${groups.indexOf(body.group)}1`;
                    await database.update('recruitments',
                        { title: body.title },
                        { time1: { ...recruitment.time1, [body.group]: body.date } }
                    );
                } else if (body.step === '熬测流程') {
                    formId = `${recruitment['_id']}2`;
                    await database.update('recruitments', { title: body.title }, { time2: body.date });
                }
            }
            if (verifyCode(body.code)) {
                body.candidates.map((i: string) => {
                    if (body.date) {
                        const link = `http://cvs.hustunique.com/form/${formId}/${i}`;
                        console.log(link);
                        sendSMS('content' + link);
                    } else {
                        sendSMS('content');
                    }
                });
                res.send({ type: 'success' });
            } else {
                res.send({ message: '验证码不正确', type: 'warning' })
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })()
});

// request for verification code
app.post('/verification', (req, res) => {

});

app.get('/form/:formId', (req, res) => {
    const formId = req.params.formId;
    const type = +formId.slice(-1);
    (async () => {
        try {
            if (type === 1) { // interview 1
                const groupId = +formId.slice(-2, -1);
                const group = groups[groupId];
                const recruitmentId = formId.slice(0, -2);
                const recruitment = (await database.query('recruitments', { _id: new ObjectId(recruitmentId) }))[0];
                res.send({ type: 'success', time: recruitment.time1[group] });
            } else if (type === 2) { // interview 2
                const recruitmentId = formId.slice(0, -1);
                const recruitment = (await database.query('recruitments', { _id: new ObjectId(recruitmentId) }))[0];
                res.send({ type: 'success', time: recruitment.time2 });
            } else {
                res.send({ message: '表单不存在！', type: 'warning' });
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()
});

// get all history recruitments
app.get('/recruitment', (req, res) => {
    database
        .query('recruitments', {})
        .then(data => res.send({ data: data, type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'danger' }));
});

// get a certain recruitment
app.get('/recruitment/:title', (req, res) => {
    database
        .query('recruitments', { title: req.params.title })
        .then(data => res.send({ data: data[0], type: 'success' }))
        .catch(err => res.send({ message: err.message, type: 'danger' }));
});

// launch a new recruitment
app.post('/recruitment', (req, res) => {
    database
        .insert('recruitments', {
            title: req.body.title,
            begin: req.body.begin,
            end: req.body.end,
            data: groups.map(i => ({ group: i, total: 0, steps: [0, 0, 0, 0, 0, 0] })),
            total: 0,
        })
        .then(() => {
            res.send({ type: 'success' });
            io.emit('updateRecruitment');
        })
        .catch(err => res.send({ message: err.message, type: 'danger' }));
});


// move a candidate from step a to step b
let processing: string[] = []; // deal with conflicts
const onMoveCandidate = (socket: Socket) => (cid: string, from: number, to: number) => {
    (async () => {
        try {
            if (!processing.includes(cid)) {
                processing.push(cid);
                database.update('candidates', { _id: new ObjectId(cid) }, { step: to })
                    .then(() => {
                        socket.broadcast.emit('moveCandidate', cid, from, to);
                        socket.emit('moveCandidateSuccess');
                        processing = processing.filter(i => i !== cid);
                    })
                    .catch(err => socket.emit('moveCandidateError', err.message, 'danger', { cid, from, to }));
            } else {
                socket.emit('moveCandidateError', '候选人已被拖动', 'warning', { cid, from, to });
            }
        } catch (err) {
            socket.emit('moveCandidateError', err.message, 'danger');
        }
    })();
    (async () => {
        const candidate = (await database.query('candidates', { _id: new ObjectId(cid) }))[0];
        const recruitment = (await database.query('recruitments', { title: candidate['title'] }))[0];
        const data = recruitment['data'].map((i: object) => {
            if (i['group'] === candidate['group']) {
                if (!i['steps'][to]) i['steps'][to] = 0;
                if (!i['steps'][from]) i['steps'][from] = 0;
                i['steps'][to] += 1;
                i['steps'][from] -= 1;
                if (i['steps'][to] < 0) i['steps'][to] = 0;
                if (i['steps'][from] < 0) i['steps'][from] = 0;
            }
            return i;
        });
        await database.update('recruitments', { title: candidate['title'] }, { data });
        io.emit('updateRecruitment');
    })();
};

// delete a certain candidate
const onRemoveCandidate = (socket: Socket) => (cid: string) => {
    (async () => {
        const candidate = (await database.query('candidates', { _id: new ObjectId(cid) }))[0];
        database
            .delete('candidates', { _id: new ObjectId(cid) })
            .then(() => io.emit('removeCandidate', cid))
            .catch(err => socket.emit('moveCandidateError', err.message, 'warning'));

        const recruitment = (await database.query('recruitments', { title: candidate['title'] }))[0];
        const data = recruitment['data'].map((i: object) => {
            if (i['group'] === candidate['group']) {
                i['total'] -= 1;
                if (i['total'] < 0) i['total'] = 0;
                i['steps'][candidate['step']] -= 1;
                if (i['steps'][candidate['step']] < 0) i['steps'][candidate['step']] = 0;
            }
            return i;
        });
        await database.update('recruitments', { title: candidate['title'] }, { data, total: recruitment['total'] - 1 });
        io.emit('updateRecruitment');
    })()
};

// comment on a certain candidate
const onAddComment = (socket: Socket) => (step: number, cid: string, uid: string, comment: object) => {
    database
        .update('candidates', { _id: new ObjectId(cid) }, { ['comments.' + uid]: comment })
        .then(() => io.emit('addComment', step, cid, uid, comment))
        .catch(err => socket.emit('addCommentError', err.message, 'danger'));
};

// delete comment on a certain candidate
const onRemoveComment = (socket: Socket) => (step: number, cid: string, uid: string) => {
    database
        .update('candidates', { _id: new ObjectId(cid) }, { [`comments.${uid}`]: '' }, true)
        .then(() => io.emit('removeComment', step, cid, uid))
        .catch(err => socket.emit('removeCommentError', err.message, 'danger'));
};

io.on('connection', (socket) => {
    console.log('WebSocket connected');
    socket.on('moveCandidate', onMoveCandidate(socket));
    socket.on('removeCandidate', onRemoveCandidate(socket));
    socket.on('addComment', onAddComment(socket));
    socket.on('removeComment', onRemoveComment(socket))
});

server.listen(5000);
