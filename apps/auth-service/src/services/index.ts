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

const createUser = async (
  name: string,
  email: string,
  hashedPassword: string
) => {
  // create user
  const query = `
        INSERT INTO "User" (name, password) 
        VALUES ($1, $2) 
        RETURNING *
    `;
  const params = [name, hashedPassword];
  const user = await executeSQLQuery(query, params);

  // automatically create user profile
  const query2 = `INSERT INTO "UserProfile" (fullname, "userId", email) VALUES ($1, $2, $3) RETURNING *`;
  const params2 = [user[0].name, user[0].id, email];
  const profile = await executeSQLQuery(query2, params2);

  return { user: user[0], profile: profile[0] };
};

export default {
  getAllUsers,
  getUserByName,
  getUserDetail,
  createUser,
};
