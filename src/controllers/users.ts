import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Users from '../models/users';
import { IUser } from '../utils/types';
import { REQUEST_SUCCESS, CREATED_SUCCESS } from '../utils/constants';
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

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email,
    } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await Users.create({
      name, about, avatar, password, email,
    });
    res.status(201).send({ _id: user._id, email: user.email });
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      throw new InvalidDataError('Переданы не все обязательны поля');
    }
    if (err.code === 11000) {
      throw new ConflictError('Такой пользователь уже существует');
    }
    next(err);
  }
};

export const updateProfile = (req: IUser, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user?._id, { name, about })
    .then((data) => {
      res.status(CREATED_SUCCESS).send(data);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new InvalidDataError('Переданы не все обязательны поля');
      }
      next(err);
    });
};

export const updateAvatar = (req: IUser, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user?._id, { avatar })
    .then((data) => {
      res.status(REQUEST_SUCCESS).send(data);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new InvalidDataError('Переданы не все обязательны поля');
      }
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
      next(err);
    });
};
