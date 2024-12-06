import { IncomingMessage, ServerResponse } from 'http';
import services from '../services';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

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
  res.end('Home route accessed!');
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
      validateBody(parsedData, ['username', 'password']);

      // Hash password
      const hash = crypto.createHash('sha256');
      hash.update(parsedData.password);
      const hashedPassword = hash.digest('hex');

      // Create user
      const user = await services.createUser(
        parsedData.username,
        hashedPassword
      );
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: (error as Error).message }));
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
        res.end(JSON.stringify({ user: user[0], token }));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ error: (error as Error).message, msg: 'zehahaha' })
        );
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: (error as Error).message, msg: 'kiwkiw' }));
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
    console.log('decodedToken', decodedToken);
    res.end('Protected route accessed!');
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: (error as Error).message }));
  }
};

export default {
  Index,
  Register,
  Login,
  Protect,
};
