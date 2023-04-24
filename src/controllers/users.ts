import { Request, Response } from 'express';
import Users from '../models/users';
import { IUser } from '../types/types';

export const getAllUsers = (req: Request, res: Response) => Users.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const getUser = (req: Request, res: Response) => {
  Users.findById(req.params._id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return Users.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateProfile = (req: IUser, res: Response) => {
  const { name, about } = req.body;

  return Users.findByIdAndUpdate(req.user?._id, {
    name,
    about,
  })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateAvatar = (req: IUser, res: Response) => {
  const { avatar } = req.body;
  return Users.findByIdAndUpdate(req.user?._id, {
    avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
