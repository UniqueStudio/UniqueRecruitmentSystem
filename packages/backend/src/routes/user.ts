import express from 'express';
import { getGroup, getInfo, handleLogin, handleScan, setInfo, setInfoVerify } from '../actions/user';
import { authenticator } from '../middlewares/authenticator';

const router = express.Router();

// login: get QR code
router.get('/login', handleLogin);

// login: scan QR code
router.get('/:key/status', handleScan);

router.use(authenticator);

// get one's info
router.get('/', getInfo);

// change one's info
router.put('/', setInfoVerify, setInfo);

// get users in one's group
router.get('/group', getGroup);

export const user = router;
