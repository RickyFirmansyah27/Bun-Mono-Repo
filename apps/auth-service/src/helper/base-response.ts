import { Context } from 'baojs';
import { BusinessException } from './business-exception';

type ResponseType =
  | 'created'
  | 'success'
  | 'unauthorized'
  | 'forbidden'
  | 'badRequest'
  | 'internalServerError';

export const BaseResponse = (
  ctx: Context,
  resMessage: string,
  type: ResponseType,
  result: any = null
) => {
  let response;
  let status = 200;

  switch (type) {
    case 'created':
      response = BusinessException.createdResponse(resMessage);
      status = 201;
      break;
    case 'success':
      response = BusinessException.successResponse(result, resMessage);
      status = 200;
      break;
    case 'badRequest':
      response = BusinessException.badRequestResponse(resMessage, result);
      status = 400;
      break;
    case 'unauthorized':
      response = BusinessException.unauthorizedResponse(resMessage);
      status = 403;
      break;
    case 'forbidden':
      response = BusinessException.unauthorizedResponse(resMessage);
      status = 403;
      break;
    case 'internalServerError':
      response = BusinessException.internalServerErrorResponse();
      status = 500;
      break;
    default:
      response = BusinessException.successResponse(result, resMessage);
  }

  return ctx.sendPrettyJson(response, { status, headers: {} });
};
