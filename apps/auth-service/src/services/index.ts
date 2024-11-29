import sql from '../db';
import { executeSQLQuery, executeSQLTransaction } from '../db/dbPoolService';

const getAllUsers = () => {
  const query = 'SELECT * FROM "User"';

  return executeSQLQuery(query);
};

const getUserByName = async (name: string) => {
  const query = `SELECT * FROM "User" WHERE name = $1`;
  const params = [name];

  return executeSQLQuery(query, params);
};

const createUser = async (name: string, hashedPassword: string) => {
  const user = await sql`
        INSERT INTO "User" (name, password) 
        VALUES (${name}, ${hashedPassword}) 
        RETURNING *
    `;
  await sql`INSERT INTO "UserProfile" (fullname, "userId") VALUES (${name}, ${user[0].id})`;
  return user;
};

export default {
  getAllUsers,
  getUserByName,
  createUser,
};
