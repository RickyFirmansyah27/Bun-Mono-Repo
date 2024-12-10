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


export default {
  getAllUsers,
  getUserByName,
  getUserDetail,
};
