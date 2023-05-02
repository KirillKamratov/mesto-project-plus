import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Cards from '../models/cards';
import { IUser } from '../utils/types';
import { CREATED_SUCCESS, REQUEST_SUCCESS } from '../utils/constants';
import InvalidDataError from '../errors/invalid-data';
import ForbiddenError from '../errors/forbidden';
import NotFoundError from '../errors/not-found';

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find({}).populate(['owner', 'likes'])
    .then((data) => res.status(REQUEST_SUCCESS).send(data))
    .catch((err) => {
      next(err);
    });
};

export const createCard = (req: IUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user?._id;
  Cards.create({ name, link, ownerId })
    .then((data) => res.status(CREATED_SUCCESS).send(data))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new InvalidDataError('Данные некорректны');
      }
      next(err);
    });
};

export const deleteCard = async (req: IUser, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    const cardToDelete = await Cards.findById(cardId).orFail(() => new NotFoundError('Такой карточки не существует'));
    if (cardToDelete.owner.toString() !== req.user?._id) {
      return next(new ForbiddenError('Вы пытаетесь удалить чужую карточку'));
    }
    const deletedCard = await cardToDelete.deleteOne();
    return res.status(REQUEST_SUCCESS).send(deletedCard);
  } catch (err: any) {
    return err(next);
  }
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
