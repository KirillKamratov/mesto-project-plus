import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
} from '../controllers/users';

const router = Router();
router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
