import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Users from '../models/users';
import { IUser } from '../utils/types';
import {
  ERROR_DEFAULT, ERROR_INVALID_DATA, ERROR_NOT_FOUND, REQUEST_SUCCESS,
} from '../utils/constants';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Users.find({});
    return res.status(REQUEST_SUCCESS).send(users);
  } catch (err) {
    return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await Users.findById(userId);

    if (!user) {
      const error = new Error('Пользователь не найден');
      error.name = 'NotFound';
      throw error;
    }

    return res.status(REQUEST_SUCCESS).send(userId);
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFound') {
      return res.status(ERROR_NOT_FOUND).send({ message: err.message });
    }

    if (err instanceof mongoose.Error.CastError) {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }
    return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    if (!name || !about || !avatar) {
      const error = new Error('Переданы не все обязательны поля');
      error.name = 'CustomValid';
      throw error;
    }
    const newUser = await Users.create(req.body);
    return res.status(201).send(newUser);
  } catch (err) {
    if (err instanceof Error && err.name === 'CustomValid') {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateProfile = async (req: IUser, res: Response) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      const error = new Error('Переданы не все обязательны поля');
      error.name = 'CustomValid';
      throw error;
    }
    const updatedUser = await Users.findByIdAndUpdate(req.user?._id, req.body);
    return res.status(201).send(updatedUser);
  } catch (err) {
    if (err instanceof Error && err.name === 'CustomValid') {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateAvatar = async (req: IUser, res: Response) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      const error = new Error('Переданы не все обязательны поля');
      error.name = 'CustomValid';
      throw error;
    }
    const updatedAvatar = await Users.findByIdAndUpdate(req.user?._id, req.body);
    return res.status(201).send(updatedAvatar);
  } catch (err) {
    if (err instanceof Error && err.name === 'CustomValid') {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
  }
};
