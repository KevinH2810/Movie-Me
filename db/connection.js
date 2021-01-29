const chalk = require('chalk');
const config = require('../config/config');

const { Pool } = require('pg')
const conn = new Pool({
  user: config.db.USER,
  host: config.db.HOST,
  database: config.db.DBNAME,
  password: config.db.PASSWORD,
  port: config.db.PORT,
})
conn.query('SELECT NOW()', (err, res) => {
    console.log(chalk.green("database Connected")) 
})

module.exports = { conn }