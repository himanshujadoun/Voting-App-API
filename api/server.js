// const app = require('../app');
// const serverless = require('serverless-http');

// module.exports = serverless(app);


const app = require('../app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
