import { Request, Response } from 'express';
import Cards from '../models/cards';
import { IUser } from '../types/types';

export const getAllCards = (req: Request, res: Response) => Cards.find({})
  .populate('user')
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  return Cards.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => {
  Cards.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const likeCard = (req: IUser, res: Response) => Cards.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const dislikeCard = (req: IUser, res: Response) => Cards.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
