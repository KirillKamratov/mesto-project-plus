import { Router } from 'express';
import {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { cardCreationValidation } from '../middlewares/validation';

const router = Router();
router.get('/', getAllCards);
router.post('/', cardCreationValidation, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
