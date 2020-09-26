import request from 'supertest';
import { app } from '../src/app';
import { UserRepo } from '../src/database/model';
import { generateJWT } from '../src/utils/generateJWT';

describe('GET /candidate', () => {
    it('should return success', async (done) => {
        const users = await UserRepo.query({ weChatID: 'foo' });
        expect(users.length).toBe(1);
        const token = generateJWT({ id: users[0]._id }, 100000);
        request(app)
            .get(`/candidate/${JSON.stringify({title: '2021C', group: 'web'})}`)
            .set({
                Authorization: token
            })
            .end((err, res) => {
                console.log(res.text);
                expect(JSON.parse(res.text).type).toBe('success');
                done();
            });
    });
});
