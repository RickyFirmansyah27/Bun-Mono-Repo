import { IncomingMessage, ServerResponse } from 'http';
import services from '../services';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { BaseResponse, Logger } from '../helper';
import { attemptSend, jwtConfig } from '@bun/utils';

const secret = process.env.JWT_SECRET;
const jwtExpired = process.env.JWT_EXPIRED;
const jwtIssuer = process.env.JWT_ISSUER;
const jwtAudience = process.env.JWT_CLIENT;


// Helper untuk validasi input
const validateBody = (body: any, requiredFields: string[]) => {
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`${field} is required`);
    }
  }
};

const Index = (req: IncomingMessage, res: ServerResponse) => {
  const response = {
    message: 'Hello from index route',
  };
  BaseResponse(res, 'You are accessing index route', 'success', response);
};
const Register = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      if (req.headers['content-type'] !== 'application/json') {
        throw new Error('Invalid content type. Use application/json');
      }
      const parsedData = JSON.parse(body); // Parse JSON
      validateBody(parsedData, ['username', 'password', 'email']);

      // Hash password
      const hash = crypto.createHash('sha256');
      hash.update(parsedData.password);
      const hashedPassword = hash.digest('hex');

      // Create user
      // const user = await services.createUser(
      //   parsedData.username,
      //   parsedData.email,
      //   hashedPassword
      // );

      // Send email
      const payload = {
        email: 'email@email.com',
        subject: 'Registration success',
        message: 'You have successfully registered',
      };
      attemptSend(payload, 'USER_REGISTRATION', (err) => {
        if (err) {
          Logger.error('Error sending email:', err);
          return;
        }
        Logger.info('Send email successfully');
      });

      BaseResponse(res, 'User created', 'success', { msg: 'hello' });
    } catch (error) {
      Logger.error('Error:', error);
      BaseResponse(res, (error as Error).message, 'badRequest', null);
    }
  });
};

const Login = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        if (req.headers['content-type'] !== 'application/json') {
          throw new Error('Invalid content type. Use application/json');
        }
        const parsedData = JSON.parse(body); // Parse JSON
        validateBody(parsedData, ['username', 'password']);

        // Hash password
        const hash = crypto.createHash('sha256');
        hash.update(parsedData.password);
        const hashedPassword = hash.digest('hex');

        // Get user
        const user = await services.getUserByName(parsedData.username);
        if (!user.length) {
          throw new Error('User not found');
        }

        if (user[0].password !== hashedPassword) {
          throw new Error('Invalid password');
        }
        const payload = { username: user[0].name, id: user[0].id };
        const token = jwt.sign(payload, secret as string, {
          expiresIn: jwtExpired,
          issuer: jwtIssuer,
          audience: jwtAudience,
        });

        const result = {
          user: user[0],
          token,
        };
        BaseResponse(res, 'Login success', 'success', result);
      } catch (error) {
        Logger.error('Error:', error);
        BaseResponse(res, (error as Error).message, 'badRequest', null);
      }
    });
  } catch (error) {
    BaseResponse(res, (error as Error).message, 'badRequest', null);
  }
};
const Protect = (req: IncomingMessage, res: ServerResponse): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid token');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, secret as string, {
      issuer: jwtIssuer,
      audience: jwtAudience,
    });
    Logger.info(`[Token Payload]: ${JSON.stringify(decodedToken)}`);
    BaseResponse(res, 'Protected route accessed!', 'success', decodedToken);
  } catch (error) {
    Logger.error('Error:', error);
    BaseResponse(res, (error as Error).message, 'badRequest', null);
  }
};

export default {
  Index,
  Register,
  Login,
  Protect,
};
