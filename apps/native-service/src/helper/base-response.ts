import { ServerResponse } from 'http';
import { BusinessException } from './business-exception';

type ResponseType =
  | 'created'
  | 'success'
  | 'unauthorized'
  | 'forbidden'
  | 'badRequest'
  | 'internalServerError'
  | 'notFound';

export const BaseResponse = (
  res: ServerResponse,
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
    case 'notFound':
      response = BusinessException.notFoundResponse(resMessage);
      status = 404;
      break;
    case 'internalServerError':
      response = BusinessException.internalServerErrorResponse();
      status = 500;
      break;
    default:
      response = BusinessException.successResponse(result, resMessage);
  }

  res.statusCode = status;
  res.end(JSON.stringify(response));
};
