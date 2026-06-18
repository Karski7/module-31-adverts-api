const http = require('http');
const { once } = require('events');

const { createApp } = require('../src/app');
const { connectDatabase, disconnectDatabase } = require('../src/db');
const { seedDatabase } = require('../src/seed');

const request = (port, path, options = {}) => new Promise((resolve, reject) => {
  const req = http.request({
    hostname: 'localhost',
    port,
    path,
    method: options.method || 'GET',
    headers: options.headers || {},
  }, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
  });

  req.on('error', reject);
  if (options.body) req.write(options.body);
  req.end();
});

const main = async () => {
  const db = await connectDatabase();
  const app = createApp({ sessionStore: db.sessionStore });
  await seedDatabase();

  const server = app.listen(0);
  await once(server, 'listening');
  const port = server.address().port;

  const ads = await request(port, '/api/ads');
  if (ads.status !== 200 || !ads.body.includes('City bike')) throw new Error('GET /api/ads failed');

  const search = await request(port, '/api/ads/search/bike');
  if (search.status !== 200 || !search.body.includes('City bike')) throw new Error('GET /api/ads/search failed');

  const loginBody = JSON.stringify({ login: 'demo', password: 'secret123' });
  const login = await request(port, '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginBody),
    },
    body: loginBody,
  });
  if (login.status !== 200) throw new Error('POST /auth/login failed');

  const cookie = login.headers['set-cookie'][0].split(';')[0];
  const user = await request(port, '/auth/user', { headers: { Cookie: cookie } });
  if (user.status !== 200 || !user.body.includes('demo')) throw new Error('GET /auth/user failed');

  await new Promise((resolve) => server.close(resolve));
  await disconnectDatabase();
  console.log('Smoke test passed');
};

main().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
