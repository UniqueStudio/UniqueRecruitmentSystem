import request from 'supertest';
import { app } from '../src/servers/http';
import { UserRepo } from '../src/database/model';
import { generateJWT } from '../src/utils/generateJWT';

describe('POST /recruitment', () => {
    it('should create a new recruitment', async (done) => {
        const users = await UserRepo.query({ weChatID: 'foo' });
        expect(users.length).toBe(1);
        const token = generateJWT({ id: users[0]._id.toString() }, 100000);
        request(app)
            .post('/recruitment')
            .set({
                Authorization: token,
            })
            .send({
                title: '2021C',
                begin: `${Date.now()}`,
                stop: `${Date.now() + 5000000}`,
                end: `${Date.now() + 10000000}`,
                code: '1234',
            })
            .end((err, res) => {
                console.log(JSON.parse(res.text));
                expect(JSON.parse(res.text).type).toBe('success');
                done();
            });
    });
});
