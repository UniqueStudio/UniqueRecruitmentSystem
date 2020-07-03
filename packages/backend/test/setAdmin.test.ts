import request from 'supertest';
import { app } from '../src/app';
import { UserRepo } from '../src/database/model';
import { generateJWT } from '../src/utils/generateJWT';
import { randomBytes, scryptSync } from 'crypto';

describe('POST /user/admin', () => {
    it('should return success', async (done) => {
        const users = await UserRepo.query({ weChatID: 'foo' });
        expect(users.length).toBe(1);

        const admin = await UserRepo.query({ weChatID: 'bar' });
        if (!admin.length) {
            const salt = randomBytes(16).toString('base64');
            const hash = scryptSync('password', salt, 64).toString();
            await UserRepo.createAndInsert({
                weChatID: 'bar',
                username: 'colinaaa',
                joinTime: '2020C',
                phone: '13456789012',
                avatar: '',
                mail: 'foo@bar.com',
                isCaptain: false,
                isAdmin: false,
                gender: 0,
                group: 'web',
                password: {
                    salt,
                    hash
                }
            });
        } else {
            await UserRepo.updateById(admin[0]._id, { isAdmin: false });
        }
        const token = generateJWT({ id: users[0]._id }, 100000);
        request(app)
            .post('/user/admin')
            .set({
                Authorization: token
            })
            .send({
                group: 'web',
                who: ['w1nd3r1c4', 'colinaaa', 'faker']
            })
            .end(async (err, res) => {
                const result = JSON.parse(res.text);
                console.log(result);
                expect(result.type).toBe('success');
                const admin = await UserRepo.query({ weChatID: 'bar' });
                expect(admin.length).toBe(1);
                expect(admin[0].isAdmin).toBe(true);
                done();
            });
    });
});
