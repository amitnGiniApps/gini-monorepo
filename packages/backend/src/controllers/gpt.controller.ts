import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { createCustomError } from '../error/customAPIError';
import { BAD_REQUEST } from '../constants';
import { generateProject } from '../services/gptGenerator';

export const gptController = asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any>=>{
  if (Object.keys(req.body).length === 0) {
    return next(createCustomError(BAD_REQUEST, StatusCodes.BAD_REQUEST));
  }
  await generateProject();
  // if (!result) return next(createCustomError(SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR));

  return res.status(StatusCodes.OK).json({ data: 'done' });
});
