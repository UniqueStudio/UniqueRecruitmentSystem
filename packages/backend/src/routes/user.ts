import { Router } from 'express';
import { getGroup, getInfo, handleLogin, handleLoginVerify, handleQR, handleScan, setInfo, setInfoVerify, setAdmin, setAdminVerify } from '../actions/user';
import { authenticator } from '@mw/authenticator';

const router = Router();

// login: get QR code
router.get('/qrCode', handleQR);

// login: scan QR code
router.get('/qrCode/:key', handleScan);

// login: password
router.post('/login', handleLoginVerify, handleLogin);

router.use(authenticator);

// get one's info
router.get('/', getInfo);

// change one's info
router.put('/', setInfoVerify, setInfo);

// get users in one's group
router.get('/group', getGroup);

// set users to admin
router.post('/admin', setAdminVerify, setAdmin);

export const user = router;
