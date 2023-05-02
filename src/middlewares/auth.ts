import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized';

const { SECRET_KEY } = process.env;

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

// eslint-disable-next-line consistent-return
const auth = async (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY!);
  } catch (error) {
    const newError = new UnauthorizedError('Требуется авторизация');
    return next(newError);
  }
  req.user = payload;
  next();
};

export default auth;
