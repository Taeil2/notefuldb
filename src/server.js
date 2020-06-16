const knex = require('knex');
const app = require('./app');
const {PORT}=require('./config');

const db = knex({
  client:'pg',
  connection:process.env.NODE_ENV==='test'?process.env.TEST_DB_URL:process.env.DB_URL,
});

app.set('db',db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});