import mysql from 'mysql2';
import * as dotenv from 'dotenv';
// require("dotenv").config();

dotenv.config();

// console.log(process.env.DB_HOST);

export const pool = mysql.createPool({
  connectionLimit : 10,
  user            : process.env.DB_USER || 'root',
  host            : process.env.DB_HOST || 'localhost',
  password        : process.env.DB_PASSWORD || '12345678',
  database        : process.env.DB_NAME || 'vacations',
  port            : 3306
});

pool.getConnection((error, connection) => {
  if(error){
    console.error(`Failed to get connection from pool: ${error}`);
    return;
  }
  console.log('Connected to the Database!');
  connection.release();
});