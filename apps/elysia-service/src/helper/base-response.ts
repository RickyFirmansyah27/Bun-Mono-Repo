import { Context } from 'elysia';
import { BusinessException } from './business-exception';

export enum ResponseType {
  CREATED = 'created',
  SUCCESS = 'success',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  INTERNAL_SERVER_ERROR = 'internalServerError'
}

const StatusCodes = {
  [ResponseType.CREATED]: 201,
  [ResponseType.SUCCESS]: 200,
  [ResponseType.UNAUTHORIZED]: 403,
  [ResponseType.FORBIDDEN]: 403,
  [ResponseType.INTERNAL_SERVER_ERROR]: 500
} as const;

export const BaseResponse = (
  res: Context,
  resMessage: string,
  type: ResponseType,
  result: any = null,
): string => {
  let response = res.response;
  const status = StatusCodes[type] || 200;

  switch (type) {
    case ResponseType.CREATED:
      response = BusinessException.createdResponse(resMessage);
      break;
    case ResponseType.SUCCESS:
      response = BusinessException.successResponse(result, resMessage);
      break;
    case ResponseType.UNAUTHORIZED:
    case ResponseType.FORBIDDEN:
      response = BusinessException.unauthorizedResponse(resMessage);
      break;
    case ResponseType.INTERNAL_SERVER_ERROR:
      response = BusinessException.internalServerErrorResponse();
      break;
    default:
      response = BusinessException.successResponse(result, resMessage);
  }

  // Set the response status code
  res.set.status = status;

  return JSON.stringify(response);
};