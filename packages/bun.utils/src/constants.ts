/* eslint-disable no-unused-vars */
export const PORT_SERVICE = {
  authService: 8100,
  expressService: 8001,
  honoService: 8002,
  elysiaService: 8003,
  fastifyService: 8004,
  koaService: 8005,
  // add more
};

export const resMessage = {
  badImplementation: 'Internal Server Error',
  badRequest: 'Invalid input payload',
  notFound: 'Data not found',
  emptyData: 'Data is empty',
  success: 'Successfully',
  validationRole: 'Role is not allowed',
  forbidden: 'Cannot access this API',
  created: 'Successfully created data',
  updated: 'Successfully updated data',
  deleted: 'Successfully deleted data',
  // add more
};

// db environment
export const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'secret',
  port: 6379,
  database: 'bun',
};
