import { Request, Response } from 'express';
import { BaseResponse, Logger } from '../helper';
import 'express-boom';
import userService from '../service/user-service';

interface User {
    id: number;
    name: string;
    email: string;
}

const users: User[] = [];

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const contextLogger = 'UserController';
    try {
        Logger.info(`${contextLogger} | getUser`);
        const users = await userService.getAllUsers();
        Logger.info(`${contextLogger} | users: ${JSON.stringify(users)}`);
        return BaseResponse(res, 'Users retrieved successfully', 'success',  users);
    } catch (error) {
        Logger.error(`${contextLogger} | error: ${(error as Error).message}`);
        return BaseResponse(res, 'error', 'internalServerError', null);
    }
};

export const getUserDetail = async (req: Request, res: Response): Promise<void> => {
    const contextLogger = 'UserController';
    const { id } = req.params;

    try {
        Logger.info(`${contextLogger} | getUser | ID: ${id}`);

        if (!id) {
            Logger.error(`${contextLogger} | getUser | Missing required parameter: id`);
            return BaseResponse(res, 'ID is required', 'badRequest', null);
        }

        const users = await userService.getUserDetail(id);

        if (!users) {
            Logger.warn(`${contextLogger} | getUser | User not found with ID: ${id}`);
            return BaseResponse(res, 'User not found', 'notFound', null);
        }

        return BaseResponse(res, 'Users retrieved successfully', 'success', users);
    } catch (error) {
        Logger.error(`${contextLogger} | getUser | error: ${(error as Error).message}`);
        return BaseResponse(res, 'error', 'internalServerError', null);
    }
};
