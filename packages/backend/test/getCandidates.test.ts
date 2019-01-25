import request from 'supertest';
import { app } from '../src/app';
import { generateJWT } from '../src/utils/generateJWT';

const token = generateJWT({ id: '5c432947a4f608756d550fcf' }, 100000);

describe('GET /candidate', () => {
    it('should return success', (done) => {
        return request(app)
            .get(`/candidate/${JSON.stringify({title: '2018A', group: 'lab'})}`)
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
