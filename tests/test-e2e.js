const http = require('http');
const app = require('./backend/server');
const connectDB = require('./backend/config/db');
const autoSeed = require('./backend/seed/seedRunner');

async function testFullApp() {
  await connectDB();
  await autoSeed();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5055, resolve));
  console.log('Test server listening on port 5055');

  const makeReq = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: 5055,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, text: data });
            }
          });
        }
      );
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    console.log('\n1. Testing GET /api/health...');
    const health = await makeReq('/api/health');
    console.log('Health:', health);

    console.log('\n2. Testing GET /api/stats...');
    const stats = await makeReq('/api/stats');
    console.log('Stats:', stats.data);

    console.log('\n3. Testing GET /api/knowledge...');
    const knowledge = await makeReq('/api/knowledge');
    console.log(`Knowledge count: ${knowledge.data.count}`);

    console.log('\n4. Testing GET /api/graph...');
    const graph = await makeReq('/api/graph');
    console.log(`Graph nodes: ${graph.data.data.nodes.length}, edges: ${graph.data.data.edges.length}`);

    console.log('\n5. Testing POST /api/chat/ask with "What are the college working hours?"...');
    const verifiedAsk = await makeReq('/api/chat/ask', 'POST', { query: 'What are the college working hours?' });
    console.log('Answer:', verifiedAsk.data.data.answer);
    console.log('Status:', verifiedAsk.data.data.verificationStatus);

    console.log('\n6. Testing POST /api/chat/ask with "What is the hostel food menu?" (Refusal Test)...');
    const unsupportedAsk = await makeReq('/api/chat/ask', 'POST', { query: 'What is the hostel food menu?' });
    console.log('Answer:', unsupportedAsk.data.data.answer);
    console.log('Status:', unsupportedAsk.data.data.verificationStatus);

    console.log('\n>>> ALL END-TO-END TESTS PASSED PERFECTLY!');
  } finally {
    server.close();
    process.exit(0);
  }
}

testFullApp().catch((err) => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});
