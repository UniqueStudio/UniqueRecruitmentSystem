## !NEED TO BE UPDATED!
## HTTP

* port

    5000

### USER LOGIN

* path

    /user

* method

    POST

* request params

        none

* body

        { username: string }

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### GET USER INFO

* path

    /user/:uid

* method

    GET

* request params

        uid: string

* body

        none

* success response

        { data: {...}, type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### CHANGE USER INFO

* path

    /user/:uid

* method

    PUT

* request params

        uid: string

* body

        {
             joinTime: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
             isCaptain: boolean;
             isAdmin: boolean;
             phone: string;
             mail: string;
             sex: "Male" | "Female";
             group: "web" | "lab" | "ai" | "game" | "android" | "ios" | "design" | "pm";
        }

* success response

        { data: {...}, type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### ADD NEW CANDIDATE

* path

    /candidate

* method

    POST

* request params

        none

* body

        {
            name: string;
            grade: string;
            institute: string;
            major: string;
            score: "10%" | "25%" | "50%" | "100%";
            mail: string;
            phone: string;
            group: "web" | "lab" | "ai" | "game" | "android" | "ios" | "design" | "pm";
            sex: "Male" | "Female";
            intro: string;
            title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
        }

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### UPDATE CANDIDATE INFO / INTERVIEW TIME

* path

    /candidates/:cid

* method

    PUT

* request params

        cid: string

* body

        {
            patch: object; // patch info
        }

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### GET ALL CANDIDATES

* path

    /candidates

* method

    GET

* request params

        none

* body

        none

* success response

        { data: [{...}, {...}, {...}, {...}, {...}, {...}], type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### GET CANDIDATES IN CERTAIN GROUP

* path

    /candidates/:group

* method

    GET

* request params

        group: string

* body

        none

* success response

        { data: [{...}, {...}, {...}, {...}, {...}, {...}], type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### MOVE CANDIDATE FROM STEP A TO STEP B

* path

    /candidates/:cid/step/:to

* method

    PUT

* request params

        cid: string;
        to: number;

* body

        {
            from: number;
        }

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### DELETE CANDIDATE

* path

    /candidates/:cid

* method

    DELETE

* request params

        cid: string

* body

        none

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### COMMENT ON CANDIDATE

* path

    /candidates/:cid/comments

* method

    POST

* request params

        cid: string

* body

        {
            uid: string;
            comment: {
                comment: string;
                evaluation: 'good' | 'so-so' | 'bad';
            }
        }

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### DELETE COMMENT ON CANDIDATE

* path

    /candidates/:cid/comments/:uid

* method

    DELETE

* request params

        cid: string;
        uid: string;

* body

        none

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### GET ALL RECRUITMENTS

* path

    /recruitment

* method

    GET

* request params

        none

* body

        none

* success response

        { data: [{...}, {...}, ...], type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### GET CERTAIN RECRUITMENTS

* path

    /recruitment/:title

* method

    GET

* request params

        title: string

* body

        none

* success response

        { data: {...}, type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

### LAUNCH RECRUITMENT

* path

    /recruitment

* method

    POST

* request params

        none

* body

        {
            title: string;
            begin: number; // unix timestamp
            end: number;
        }

* success response

        { type: 'success' }

* failure response

        { message: 'error message', type: 'warning' }

## WEBSOCKET (SERVER-SIDE)

### MOVE CANDIDATE

    io.emit('moveCandidate', cid: string, from: number, to: number);

### DELETE CANDIDATE

    io.emit('removeCandidate', cid: string);

### COMMENT ON CANDIDATE

    io.emit('addComment', step: number, cid: string, uid: string, comment: object);

### DELETE COMMENT ON CANDIDATE

    io.emit('removeComment', step: number, cid: string, uid: string);
