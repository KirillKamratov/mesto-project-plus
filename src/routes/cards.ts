import { Router } from 'express';
import {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { cardCreationValidation, idValidation } from '../middlewares/validation';

const router = Router();
router.get('/', getAllCards);
router.post('/', cardCreationValidation, createCard);
router.delete('/:cardId', idValidation, deleteCard);
router.put('/:cardId/likes', idValidation, likeCard);
router.delete('/:cardId/likes', idValidation, dislikeCard);

export default router;
