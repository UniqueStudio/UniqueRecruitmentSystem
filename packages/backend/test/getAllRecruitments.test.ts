import request from 'supertest';
import { app } from '../src/app';
import { generateJWT } from '../src/utils/generateJWT';

const token = generateJWT({ id: '123' }, 100000);

describe('GET /recruitment', () => {
    it('should return success', (done) => {
        return request(app)
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
