import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import notFoundRouter from './notFound';
import { createUser, login } from '../controllers/users';
import { loginValidation, signUpValidation } from '../middlewares/validation';
import auth from '../middlewares/auth';

const routes = Router();

routes.post('/signin', loginValidation, login);
routes.post('/signup', signUpValidation, createUser);
routes.use('/users', auth, usersRouter);
routes.use('/cards', auth, cardsRouter);
routes.use('/*', notFoundRouter);

export default routes;
