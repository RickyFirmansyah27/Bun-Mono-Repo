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

const Index = (req: Request): Response => {
  return new Response('Home route accessed!');
};
const Register = async (req: Request): Promise<Response> => {
  if (req.headers.get('Content-Type') !== 'application/json') {
    throw new Error('Invalid content type. Use application/json');
  }
  try {
    const body = await req.json();
    validateBody(body, ['username', 'password']);
    //hash password
    const hash = crypto.createHash('sha256');
    hash.update(body.password);
    const hashedPassword = hash.digest('hex');
    const user = await services.createUser(body.username, hashedPassword);
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    const err = `Error: ${(error as Error).message}`;
    return new Response(err, { status: 400 });
  }
};

const Login = async (req: Request): Promise<Response> => {
  if (req.headers.get('Content-Type') !== 'application/json') {
    throw new Error('Invalid content type. Use application/json');
  }
  try {
    const body = await req.json();
    validateBody(body, ['username', 'password']);

    const user = await services.getUserByName(body.username);
    if (!user.length) {
      throw new Error('User not found');
    }

    const hash = crypto.createHash('sha256');
    hash.update(body.password);
    const hashedPassword = hash.digest('hex');

    if (user[0].password !== hashedPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ name: body.name }, secret as string, {
      expiresIn: jwtExpired,
      issuer: jwtIssuer,
      audience: jwtAudience,
    });

    const res = {
      user: user[0],
      token,
    };

    return new Response(JSON.stringify(res), { status: 201 });
  } catch (error) {
    const err = `Error: ${(error as Error).message}`;
    return new Response(err, { status: 400 });
  }
};
const Protect = (req: Request): Response => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Invalid or expired token', { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, secret as string, {
      issuer: jwtIssuer,
      audience: jwtAudience,
    });
    return new Response('Protected route accessed!');
  } catch (error) {
    const err = `Error: ${(error as Error).message}`;
    return new Response(err, { status: 400 });
  }
};

export default {
  Index,
  Register,
  Login,
  Protect,
};
