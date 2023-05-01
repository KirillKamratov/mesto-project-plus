import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getMyself,
} from '../controllers/users';
import { userDataValidation, avatarValidation, idValidation } from '../middlewares/validation';

const router = Router();
router.get('/', getAllUsers);
router.get('/:userId', idValidation, getUser);
router.get('/me', idValidation, getMyself);
router.patch('/me', userDataValidation, updateProfile);
router.patch('/me/avatar', avatarValidation, updateAvatar);

export default router;
