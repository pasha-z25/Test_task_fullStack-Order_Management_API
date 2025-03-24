import express from 'express';

const PORT = process.env.PORT || 8888;
const app = express();

app.get('/', function (_req, res) {
  res.send('Hello World');
});

app.listen(PORT, () => {
  const localURL = `http://localhost:${PORT}`;

  console.log(
    '\x1b[36m%s\x1b[0m',
    '   Express.js 🚀 Server running successfully'
  );
  console.log(`   - Local:        ${localURL}`);
  console.log('   ');
});
