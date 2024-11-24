import { Request, Response } from 'express';
import { BaseResponse, Logger } from '../helper';
import 'express-boom';

interface User {
    id: number;
    name: string;
    email: string;
}

const users: User[] = [];

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const contextLogger = 'UserController';
    try {
        Logger.info(`${contextLogger} | getUser`, users);
        return BaseResponse(res, 'Users retrieved successfully', 'success', { data: users });
    } catch (error) {
        res.boom.internal('Internal Server Error');
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const contextLogger = 'UserController';
    try {
        const payload = req.body;
        payload.id = users.length + 1;
        users.push(payload);
        Logger.info(`${contextLogger} | createUser`, users);
        return BaseResponse(res, 'User created successfully', 'success', { data: users });
    } catch (error) {
        res.boom.internal('Internal Server Error');
    }
};
