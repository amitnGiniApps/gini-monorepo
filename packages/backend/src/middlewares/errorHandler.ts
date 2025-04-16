import { ErrorRequestHandler } from 'express';
import { CustomAPIError } from '../error/customAPIError';
import { SOMETHING_WENT_WRONG } from '../constants';
import { StatusCodes } from 'http-status-codes';

const errorHandler:ErrorRequestHandler = (error, req, res, next)=>{
  if (error instanceof CustomAPIError) {
    return res.status(error.statusCode).json({ msg:error.message });
  }
  return next(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: SOMETHING_WENT_WRONG }));
};

export default errorHandler;
