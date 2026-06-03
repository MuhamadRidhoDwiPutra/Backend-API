import request from 'supertest';
import app from '../../src/app.js';

describe('app integration', () => {
  test('health endpoint returns OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ success: true, message: 'OK' }));
  });

  test('metrics endpoint returns Prometheus content', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
  });
});
