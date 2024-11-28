import sql from '../db';

const getAllUsers = async () => {
  const users = await sql`SELECT * FROM "User"`;
  return users;
};

const getUserByName = async (name: string) => {
  const user = await sql`SELECT * FROM "User" WHERE name = ${name}`;
  return user;
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
