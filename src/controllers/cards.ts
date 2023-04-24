import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cards from '../models/cards';
import { IUser } from '../utils/types';
import {
  ERROR_DEFAULT, ERROR_INVALID_DATA, REQUEST_SUCCESS,
} from '../utils/constants';

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const cards = await Cards.find({}).populate('user');
    return res.status(REQUEST_SUCCESS).send(cards);
  } catch (err) {
    return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    if (!name || !link) {
      const error = new Error('Переданы не все обязательны поля');
      error.name = 'CustomValid';
      throw error;
    }
    const newCard = await Cards.create(req.body);
    return res.status(201).send(newCard);
  } catch (err) {
    if (err instanceof Error && err.name === 'CustomValid') {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_INVALID_DATA).send({ message: err.message });
    }

    return res.status(ERROR_DEFAULT).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const cardToDelete = await Cards.findByIdAndRemove(req.params.id);
    return res.status(REQUEST_SUCCESS).send(cardToDelete);
  } catch (err) {
    return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
  }
};

export const likeCard = async (req: IUser, res: Response) => {
  try {
    const cardToLike = Cards.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    return res.status(REQUEST_SUCCESS).send(cardToLike);
  } catch (err) {
    return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
  }
};

export const dislikeCard = async (req: IUser, res: Response) => {
  try {
    const cardToDislike = Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    return res.status(REQUEST_SUCCESS).send(cardToDislike);
  } catch (err) {
    return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
  }
};
