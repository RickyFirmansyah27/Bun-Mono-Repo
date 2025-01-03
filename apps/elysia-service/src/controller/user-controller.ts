import { Context } from 'elysia';
import { BaseResponse, Logger } from '../helper';
import { ResponseType } from '../helper/base-response';

// Define the User interface
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

const users: User[] = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        age: 28,
    },
    {
        id: 2,
        name: "Bob Smith",
        email: "bob.smith@example.com",
        age: 35,
    },
    {
        id: 3,
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        age: 22,
    },
];

export class UserController {
    static async getUser(ctx: Context) {
        const contextLogger = 'UserController';
        try {
            Logger.info(`${contextLogger} | getUser`, users);
            return BaseResponse(ctx, 'User fetched successfully', ResponseType.SUCCESS, users);
        } catch (error) {
            return BaseResponse(ctx, 'error', ResponseType.INTERNAL_SERVER_ERROR, null);
        }
    }

    static async createUser(ctx: Context) {
        const contextLogger = 'UserController';
        try {
            const payload: User = ctx.body as User;
            payload.id = users.length + 1;
            users.push(payload);
            Logger.info(`${contextLogger} | createUser`, users);
            return BaseResponse(ctx, 'User created successfully', ResponseType.SUCCESS, users);
        } catch (error) {
            return BaseResponse(ctx, 'error', ResponseType.INTERNAL_SERVER_ERROR, null);
        }
    }
}

export default UserController;
