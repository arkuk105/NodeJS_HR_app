import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

export const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('✓ Connected to MSSQL Database');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return pool;
};

export const closeDB = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log('Database connection closed');
    }
  } catch (err) {
    console.error('Error closing database:', err);
  }
};

export { sql };
