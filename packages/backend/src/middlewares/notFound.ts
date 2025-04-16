import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ROUTE_NOT_EXIST } from '../constants';

const notFound = (req:Request, res:Response)=>{
  res.status(StatusCodes.NOT_FOUND).send(ROUTE_NOT_EXIST);
};

export default notFound;
