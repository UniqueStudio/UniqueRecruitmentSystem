import request from 'supertest';
import { app } from '../src/app';
import { generateJWT } from '../src/utils/generateJWT';

const token = generateJWT({ id: '123' }, 100000);

describe('POST /recruitment', () => {
    it('should return success', (done) => {
        return request(app)
            .post('/recruitment')
            .set({
                Authorization: token
            })
            .send({
                title: '2018A',
                begin: `${Date.now()}`,
                end: `${Date.now() + 10000000}`,
                code: '1234'
            })
            .end((err, res) => {
                console.log(JSON.parse(res.text));
                expect(JSON.parse(res.text).type).toBe('success');
                done();
            });
    });
});
