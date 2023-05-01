import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Cards from '../models/cards';
import { IUser } from '../utils/types';
import { REQUEST_SUCCESS } from '../utils/constants';
import InvalidDataError from '../errors/invalid-data';
import ForbiddenError from '../errors/forbidden';

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find({}).populate('user')
    .then((data) => res.status(REQUEST_SUCCESS).send(data))
    .catch((err) => {
      next(err);
    });
};

export const createCard = (req: IUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user?._id;
  Cards.create({ name, link, ownerId })
    .then((data) => res.status(REQUEST_SUCCESS).send(data))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new InvalidDataError('Данные некорректны');
      }
      next(err);
    });
};

export const deleteCard = async (req: IUser, res: Response, next: NextFunction) => {
  if (req.user?._id !== req.body._id) {
    throw new ForbiddenError('Вы пытаетесь удалить чужую карточку');
  }
  Cards.findByIdAndRemove(req.params.id)
    .then((data) => {
      res.status(REQUEST_SUCCESS).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

export const likeCard = (req: IUser, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((data) => {
      res.status(REQUEST_SUCCESS).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

export const dislikeCard = async (req: IUser, res: Response, next: NextFunction) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((data) => {
      res.status(REQUEST_SUCCESS).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
