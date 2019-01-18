import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { accessTokenURL, ID_TO_GROUP, scanningURL, userIDURL, userInfoURL } from '../../config/consts';
import { UserRepo } from '../../database/model';
import { generateJWT } from '../../utils/generateJWT';

interface Data {
    userid: string;
    name: string;
    mobile: string;
    avatar: string;
    isleader: number;
    is_leader_in_dept: number[];
    gender: string;
    extattr: {
        attrs: { name: string, value: string }[]
    };
    email: string;
    department: number[];
}

const dataConverter = (data: Data) => {
    const {
        userid: weChatID,
        name: username,
        mobile: phone,
        avatar,
        isleader,
        is_leader_in_dept,
        gender,
        extattr,
        email: mail,
        department
    } = data;
    const isCaptain = isleader === 1 || is_leader_in_dept.includes(1);
    const groups = department.filter((i: number) => (i > 1 && i < 9) || (i > 14 && i < 26));
    if (!groups[0]) {
        throw new Error('Please set group info in WeChat first!');
    }
    const group = ID_TO_GROUP[groups[0]];
    const { attrs } = extattr;
    let joinTime;
    try {
        joinTime = attrs.filter((attr: { name: string, value: string }) => attr.name === '加入时间')[0].value;
        joinTime = joinTime.replace(/春.*/g, 'S')
            .replace(/秋.*/g, 'A')
            .replace(/夏.*/g, 'C');
        return {
            weChatID,
            username,
            joinTime,
            phone,
            avatar,
            mail,
            isCaptain,
            isAdmin: false,
            gender: +gender,
            group
        };
    } catch (error) {
        throw new Error('Please set join time in WeChat first!');
    }
};

// API of WeChat is a shit
export const handleScan: RequestHandler = async (req, res, next) => {
    try {
        const scanResponse = await fetch(`${scanningURL}${req.params.key}`);
        const scanResult = await scanResponse.text();
        const status = JSON.parse(scanResult.match(/{.+}/)![0]).status;

        if (status !== 'QRCODE_SCAN_ING') {
            return next({ message: 'Time out, please login again', type: 'info' });
        } else {
            const loginResponse = await fetch(`${scanningURL}${req.params.key}&lastStatus=${status}`);
            const loginResult = await loginResponse.text();
            const loginObj = JSON.parse(loginResult.match(/{.+}/)![0]);

            if (loginObj.status !== 'QRCODE_SCAN_SUCC') {
                return next({ message: 'Failed to login', type: 'warning' });
            } else {
                const auth_code = loginObj.auth_code;

                const accessTokenResponse = await fetch(accessTokenURL);
                const accessTokenResult = await accessTokenResponse.json();
                const accessToken = accessTokenResult.access_token;

                const userIDResponse = await fetch(userIDURL(accessToken, auth_code));
                const userIDResult = await userIDResponse.json();
                const userID = userIDResult.UserId;

                const userInfoResponse = await fetch(userInfoURL(accessToken, userID));
                const userInfoResult = await userInfoResponse.json();
                const data = dataConverter(userInfoResult);
                const users = await UserRepo.query({ weChatID: data.weChatID });
                const user = users.length ? users[0] : await UserRepo.createAndInsert(data);
                const token = generateJWT({ id: user._id }, 604800);
                res.send({ uid: user._id, token, type: 'success' });
            }
        }
    } catch (error) {
        return next(error);
    }
};
