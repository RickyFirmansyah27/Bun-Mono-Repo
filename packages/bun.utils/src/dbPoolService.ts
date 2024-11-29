import { Pool, PoolClient } from 'pg';
import { Logger } from './logger.js';
import { config } from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../.env');
config({ path: envPath });



const contextLogger = '[Neon DB - connection]';
const DBPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

/**
 * Function to test database connection
 */
export const DBConnection = async (): Promise<void> => {
  try {
    const client = await DBPool.connect();
    const result = await client.query('SELECT 1');
    const version = await client.query('SELECT version()');
    Logger.info(`${contextLogger} | Database connection successfully`, {
      connection: result.rows.length > 0,
    });
    Logger.info(`${contextLogger} | version: ${version.rows[0].version}`);
    client.release();
  } catch (err) {
    Logger.info(`${contextLogger} | Database connection error`, {
      error: (err as Error).message,
      errorDetail: (err as Error).stack,
    });
    throw err;
  }
};

/**
 * Execute SQL with parameters
 */
export const commandWithParams = async (
  sql: string,
  params: any[] = [],
): Promise<any[]> => {
  const client = await DBPool.connect();
  try {
    Logger.info(`${contextLogger} | Info - SQL: ${sql} - Params: ${JSON.stringify(params)}`);
    const result = await client.query(sql, params);
    return result.rows;
  } catch (err) {
    Logger.error(`${contextLogger} | Database connection error`, {
      error: (err as Error).message,
      errorDetail: (err as Error).stack,
    });
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Execute SQL query
 */
export const executeSQLQuery = async (
  sql: string,
  params: any[] = [],
): Promise<any[]> => {
  return commandWithParams(sql, params);
};

/**
 * Start a database transaction
 */
export const startTransaction = async (): Promise<PoolClient> => {
  const connection = await DBPool.connect();
  try {
    Logger.info(`${contextLogger} | Info | transaction`);
    await connection.query('BEGIN');
    return connection;
  } catch (err) {
    Logger.info(`${contextLogger} | Database connection error`, {
      error: (err as Error).message,
      errorDetail: (err as Error).stack,
    });
    connection.release();
    throw err;
  }
};

/**
 * Execute SQL within a transaction
 */
export const executeSQLTransaction = async (
  connection: PoolClient,
  sql: string,
  params: any[] = [],
): Promise<any[]> => {
  Logger.info(`${contextLogger} | Info - SQL: ${sql} - Params: ${JSON.stringify(params)}`);
  try {
    const result = await connection.query(sql, params);
    return result.rows;
  } catch (err) {
    Logger.info(`${contextLogger} | Database connection error`, {
      error: (err as Error).message,
      errorDetail: (err as Error).stack,
    });
    throw err;
  }
};

/**
 * Rollback a transaction
 */
export const rollbackTransaction = async (
  connection: PoolClient,
): Promise<void> => {
  try {
    await connection.query('ROLLBACK');
  } finally {
    connection.release();
  }
};

/**
 * Commit a transaction
 */
export const commitTransaction = async (
  connection: PoolClient,
): Promise<void> => {
  try {
    await connection.query('COMMIT');
  } finally {
    connection.release();
  }
};
