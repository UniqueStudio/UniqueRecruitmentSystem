import request from 'supertest';
import { app } from '../src/app';

describe('POST /candidate', () =>
    it('should return success', (done) =>
        request(app)
            .post('/candidate')
            .field('name', 'test')
            .field('mail', 'aa@bb.cc')
            .field('referrer', '')
            .field('code', '1234')
            .field('isQuick', 'false')
            .field('intro', '123')
            .field('title', '2018A')
            .field('group', 'web')
            .field('phone', '13343483554')
            .field('rank', 0)
            .field('major', 'test')
            .field('institute', 'test')
            .field('grade', 6)
            .field('gender', 0)
            .attach('resume', './package.json')
            .end((err, res) => {
                const result = JSON.parse(res.text);
                console.log(result);
                expect(result.type).toBe('success');
                done();
            })),
);
