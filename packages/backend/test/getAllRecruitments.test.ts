import request from 'supertest';
import { app } from '../src/servers/http';
import { UserRepo } from '../src/database/model';
import { generateJWT } from '../src/utils/generateJWT';

describe('GET /recruitment', () => {
    it('should return success', async (done) => {
        const users = await UserRepo.query({ weChatID: 'foo' });
        expect(users.length).toBe(1);
        const token = generateJWT({ id: users[0]._id.toString() }, 100000);
        request(app)
            .get('/recruitment')
            .set({
                Authorization: token
            })
            .end((err, res) => {
                console.log(JSON.parse(res.text));
                expect(JSON.parse(res.text).type).toBe('success');
                done();
            });
    });
});
