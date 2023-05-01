import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getMyself,
} from '../controllers/users';
import { userDataValidation, avatarValidation } from '../middlewares/validation';

const router = Router();
router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.get('/me', getMyself);
router.patch('/me', userDataValidation, updateProfile);
router.patch('/me/avatar', avatarValidation, updateAvatar);

export default router;
