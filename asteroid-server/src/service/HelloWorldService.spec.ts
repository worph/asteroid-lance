import * as supertest from 'supertest'
import HelloWorldService from './HelloWorldService'

describe('App', () => {
    it('works', () => {
            let app = new HelloWorldService().expressApp;
            supertest(app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect(200)
        }
    )
})
