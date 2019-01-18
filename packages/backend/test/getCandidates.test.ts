import request from 'supertest';
import { app } from '../src/app';
import { generateJWT } from '../src/utils/generateJWT';

const token = generateJWT({ id: '123' }, 100000);

describe('GET /candidate', () => {
    it('should return success', (done) => {
        return request(app)
            .get('/candidate')
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
