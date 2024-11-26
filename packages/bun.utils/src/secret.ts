import { config } from 'dotenv';

config({ path: '../secret.env' });

export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_CLIENT,
    expired: process.env.JWT_EXPIRED
}