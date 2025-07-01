const pg = require('pg');

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


async function connectdb() {
  try {
    await db.connect();
    console.log("Database connected !!");
  } catch (error) {
    console.log("DB FAILED TO CONNECT"); 
  }
} 
connectdb();
module.exports = db; 