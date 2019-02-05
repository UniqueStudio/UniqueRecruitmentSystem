* API

    https://hustunique.com:5000

## HTTPS

### User

* path

    /user

#### login by password

* sub-path

    /login

* method

    `POST`

* body

        {
            password: string;
            phone: string;
        }

* success response

        {
            type: 'success';
            token: string;
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get QRCode

* sub-path

    /qrCode

* method

    `GET`

* success response

        {
            type: 'success';
            key: string;
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get QRCode scanning status

* sub-path

    /qrCode/:key

* method

    `GET`

* success response

        {
            type: 'success';
            token: string;
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get user info

* sub-path

    /

* method

    `GET`

* header

        {
            Authorization: string; // jwt
        }

* success response

        {
            type: 'success';
            data: User;
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

### set user info

* sub-path

    /

* method

    `PUT`

* header

        {
            Authorization: string; // jwt
        }

* body

        {
            mail: string;
            phone: string;
            password?: string;
        }

* success response

        {
            type: 'success';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get group info

* sub-path

    /group

* method

    `GET`

* header

        {
            Authorization: string; // jwt
        }

* success response

        {
            type: 'success';
            data: User[];
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }


### CANDIDATE

* path

    /candidate

#### add candidate

* sub-path

    /

* method

    `POST`

* body

        {
            name: string;
            gender: Gender;
            grade: Grade;
            institute: string;
            major: string;
            rank: Rank;
            mail: string;
            phone: string;
            group: Group;
            title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
            intro: string;
            isQuick: boolean;
            referrer: string;
            resume?: string;
            code: string;
        }

* success response

        {
            type: 'success';
        }

    with `io.emit`:

        [{
            event: 'addCandidate';
            args: {
                candidate: Candidate;
            }
        },
        {
            event: 'updateRecruitment';
        }]

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get interview time selection form

* sub-path

    /:cid/form/:fromId

* method

    `GET`

* success response

        {
            type: 'success';
            time: Time[];
            token: string; // jwt
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### submit interview time selection form

* sub-path

    /:cid/form/:fromId

* method

    `PUT`

* header

        {
            Authorization: string; // jwt
        }

* body

        {
            teamInterview?: Time[];
            groupInterview?: Time[];
            abandon?: boolean;
        }

* success response

        {
            type: 'success';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### allocate interview time separately

* sub-path

    /:cid/interview/:type

        type: 'group' | 'team'

* method

    `PUT`

* header

        {
            Authorization: string; // jwt
        }

* body

        {
            time: number; // timestamp
        }

* success response

        {
            type: 'success';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### allocate interview time of all randomly

* sub-path

    /interview/:type

        type: 'group' | 'team'

* method

    `PUT`

* header

        {
            Authorization: string; // jwt
        }

* body

        {
            title: string;
        }

* success response

        {
            type: 'success';
            allocations: {
                id: string;
                time?: number;
            }[];
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get candidates

* sub-path

    /:query

        query: JSON.stringify({
            title,
            ...otherQueries
        }


* method

    `GET`

* header

        {
            Authorization: string; // jwt
        }

* success response

        {
            type: 'success';
            data: Candidate[];
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get resume

* sub-path

    /:cid/resume

* method

    `GET`

* header

        {
            Authorization: string; // jwt
        }

* success response

    blob

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

### RECRUITMENT

* path

    /recruitment

#### get pending titles

* sub-path

    /pending

* method

    `GET`

* success response

        {
            data: string[];
            type: 'success';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### launch recruitment

* sub-path

    /

* method

    `POST`

* header

        {
            Authorization: string; // jwt
        }

* body

        {
            title: string;
            begin: number;
            end: number;
            code: string;
        }

* success response

        {
            type: 'success';
        }

    with `io.emit`:

        {
            event: 'updateRecruitment';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get all recruitments

* sub-path

    /

* method

    `GET`

* header

        {
            Authorization: string; // jwt
        }

* success response

        {
            type: 'success';
            data: Recruitment[];
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### get recruitment

* sub-path

    /title/:title

* method

    `GET`

* header

        {
            Authorization: string; // jwt
        }

* success response

        {
            type: 'success';
            data: Recruitment;
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### set recruitment

* sub-path

    /title/:title

* method

    `PUT`

* header

        {
            Authorization: string; // jwt
        }

* body

        {
            begin: number;
            end: number;
            teamInterview?: Time[];
            groupInterview?: Time[];
            group?: Group;
        }

* success response

        {
            type: 'success';
        }

    with io.emit:

        {
            event: 'updateRecruitment';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

### SMS

* path

    /sms

#### send code to candidate

* sub-path

    /verification/candidate/:phone

* method

    `GET`

* success response

        {
            type: 'success';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### send code to user

* sub-path

    /verification/user

* method

    `GET`

* header

        {
            Authorization: string; // jwt
        }

* success response

        {
            type: 'success';
        }

* failure response

        {
            message: string;
            type: 'warning' | 'error';
        }

#### send notification to candidate

* sub-path

    /

* method

    `POST`

* header

        {
            Authorization: string; // jwt
        }

* body

        {
            type: 'accept' | 'reject' | 'group' | 'team';
            step: Step;
            time?: string;
            place?: string;
            rest?: string;
            candidates: string[];
            code: string;
        }

* success response

        {
            type: 'success';
        }

* failure response

        {
            messages: string[];
            type: 'warning' | 'error';
        }

## WEBSOCKET

#### move candidate

* emit

        {
            event: 'moveCandidate';
            args: {
                cid: string;
                from: Step;
                to: Step;
                token: string;
            }
        }

* success response

        {
            event: 'moveCandidateSuccess';
        }

    with `socket.broadcast.emit`:

        {
            event: 'moveCandidate';
            args: {
                cid: string;
                from: number;
                to: number;
                title: string;
            }
        }

* failure response

        {
            event: 'moveCandidateError';
            args: {
                message: string;
                type: 'warning' | 'error';
                data: {
                    cid: string;
                    from: number;
                    to: number;
                }
            }
        }

#### removeCandidate

* emit

        {
            event: 'removeCandidate';
            args: {
                cid: string;
                token: string;
            }
        }

* success response

    with `io.emit`:

        [{
            event: 'removeCandidate';
            args: {
                cid: string;
                title: string;
            }
        },
        {
            event: 'updateRecruitment';
        }]

* failure response

        {
            event: 'removeCandidateError';
            args: {
                message: string;
                type: 'warning' | 'error';
            }
        }

#### addComment

* emit

        {
            event: 'addComment';
            args: {
                cid: string;
                token: string;
                comment: Comment;
            }
        }

* success response

    with `io.emit`:

        {
            event: 'addComment';
            args: {
                cid: string;
                title: string;
                comment: Comment;
            }
        }

* failure response

        {
            event: 'addCommentError';
            args: {
                message: string;
                type: 'warning' | 'error';
            }
        }

#### removeComment

* emit

        {
            event: 'removeComment';
            args: {
                cid: string;
                token: string;
                id: string; // comment id
            }
        }

* success response

    with `io.emit`:

        {
            event: 'removeComment';
            args: {
                cid: string;
                title: string;
                id: string;
            }
        }

* failure response

        {
            event: 'removeCommentError';
            args: {
                message: string;
                type: 'warning' | 'error';
            }
        }

#### send chat message

* emit

        {
            event: 'sendMessage';
            args: {
                message: Message;
            }
        }

* response

    with `socket.broadcast.emit`:

        {
            event: 'receiveMessage';
            args: {
                message: Message;
            }
        }
