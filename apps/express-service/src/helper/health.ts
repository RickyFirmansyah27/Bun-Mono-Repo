import { Request, Response } from 'express';
import { BaseResponse, Logger } from '../helper';

interface Health {
    status: string;
    redis: string;
    database: string;
}


// todo promise redis database and other check
const health: Health[] = [{ status: 'ok', redis: 'ok', database: 'ok' }];

export const checkHealth = async (req: Request, res: Response): Promise<void> => {
    const contextLogger = 'HealthController';
    try {
        Logger.info(`${contextLogger} | checkHealth`, health);
        return BaseResponse(res, 'Health checked successfully', 'success', health);
    } catch (error) {
        return BaseResponse(res, 'error', 'internalServerError', null);
    }
};
