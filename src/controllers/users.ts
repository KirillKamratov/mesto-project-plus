import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/users';
import { IUser } from '../utils/types';
import { ERROR_NOT_FOUND, REQUEST_SUCCESS, CREATED_SUCCESS } from '../utils/constants';
import NotFoundError from '../errors/not-found';
import InvalidDataError from '../errors/invalid-data';
import ConflictError from '../errors/conflict';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  Users.find({})
    .then((data) => {
      res.status(REQUEST_SUCCESS).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  Users.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

export const getMyself = (req: IUser, res: Response, next: NextFunction) => {
  Users.findById(req.user?._id)
    .then((data) => {
      res.status(REQUEST_SUCCESS).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!name || !about || !avatar || !email || !password) {
    throw new InvalidDataError('Переданы не все обязательны поля');
  }
  return bcrypt.hash(password, 10)
    .then((hash: string) => {
      Users.create({
        password: hash,
        email,
        name,
        about,
        avatar,
      })
        .then((data) => {
          res.status(CREATED_SUCCESS).send(data);
        })
        .catch((err) => {
          if (err.code === 11000) {
            throw new ConflictError('Такой пользователь уже существует');
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

export const updateProfile = (req: IUser, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  if (!name || !about) {
    throw new InvalidDataError('Переданы не все обязательны поля');
  }
  Users.findByIdAndUpdate(req.user?._id, req.body)
    .then((data) => {
      res.status(CREATED_SUCCESS).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

export const updateAvatar = (req: IUser, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new InvalidDataError('Переданы не все обязательны поля');
  }
  Users.findByIdAndUpdate(req.user?._id, req.body)
    .then((data) => {
      res.status(CREATED_SUCCESS).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

export const login = (req: IUser, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new InvalidDataError('Переданы не все обязательны поля');
  }
  Users.findUserByCredentials(email, password)
    .then(() => {
      res.status(CREATED_SUCCESS).send({
        token: jwt.sign(
          { _id: req.user?._id },
          'some-secret-key',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      if (err.code === ERROR_NOT_FOUND) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      next(err);
    });
};
