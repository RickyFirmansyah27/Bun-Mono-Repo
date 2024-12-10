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
        return BaseResponse(res, 'Users retrieved successfully', 'success', { data: users });
    } catch (error) {
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

        return BaseResponse(res, 'Users retrieved successfully', 'success', { data: users });
    } catch (error) {
        Logger.error(`${contextLogger} | getUser | Error: ${error}`);
        return BaseResponse(res, 'Internal server error', 'internalServerError', null);
    }
};
