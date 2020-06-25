import request from 'supertest';
import { app } from '../src/app';

describe('POST /candidate', () => {
    it('should return success', (done) => {
        request(app)
            .post('/candidate')
            .field('name', 'test')
            .field('mail', 'aa@bb.cc')
            .field('referrer', '123')
            .field('code', '1234')
            .field('isQuick', 'false')
            .field('intro', '123')
            .field('title', '2021C')
            .field('group', 'web')
            .field('phone', '13343485564')
            .field('rank', 0)
            .field('major', 'test')
            .field('institute', 'test')
            .field('grade', 6)
            .field('gender', 1)
            .attach('resume', './package.json')
            .end((err, res) => {
                const result = JSON.parse(res.text);
                console.log(result);
                expect(result.type).toBe('success');
                done();
            });
    });
});
