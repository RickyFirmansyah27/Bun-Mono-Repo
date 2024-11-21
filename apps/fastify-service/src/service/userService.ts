// Mock data
const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" }
];

export const getUsers = async () => {
  return users;
};

export const getUser = async (id: number) => {
  return users.find((user) => user.id === id) || null;
};
