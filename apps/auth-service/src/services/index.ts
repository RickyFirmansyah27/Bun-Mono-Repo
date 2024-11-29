import { executeSQLQuery } from '@bun/utils';

const getAllUsers = () => {
  const query = 'SELECT * FROM "User"';

  return executeSQLQuery(query);
};

const getUserByName = async (name: string) => {
  const query = `SELECT * FROM "User" WHERE name = $1`;
  const params = [name];

  return executeSQLQuery(query, params);
};

const getUserDetail = async (id: string) => {
  const query = `SELECT u.id, u.name, u.password, u."createdAt", up.id AS "profileId", up.address, up.email, up.fullname, up.phone, up.role FROM "User" u JOIN "UserProfile" up ON u.id = up."userId" WHERE u.id = $1`;
  const params = [parseInt(id)];

  return executeSQLQuery(query, params);
};

const createUser = async (name: string, hashedPassword: string) => {
  // create user
  const query = `
        INSERT INTO "User" (name, password) 
        VALUES ($1, $2) 
        RETURNING *
    `;
  const params = [name, hashedPassword];
  const user = await executeSQLQuery(query, params);

  // automatically create user profile
  const query2 = `INSERT INTO "UserProfile" (fullname, "userId") VALUES ($1, $2) RETURNING *`;
  const params2 = [user[0].name, user[0].id];
  const profile = await executeSQLQuery(query2, params2);

  return { user, profile };
};

export default {
  getAllUsers,
  getUserByName,
  getUserDetail,
  createUser,
};
