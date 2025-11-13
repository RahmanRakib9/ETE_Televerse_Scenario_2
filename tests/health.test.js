const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  it('should return status UP and 200', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });
});
