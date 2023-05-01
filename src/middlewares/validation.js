import { celebrate, Joi } from 'celebrate';
import { OBJECTID_REG_EXP, PICTURE_URL_REG_EXP } from '../utils/constants';

export const userDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

export const idValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().regex(OBJECTID_REG_EXP),
  }),
});

export const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(PICTURE_URL_REG_EXP, 'URL'),
  }),
});

export const signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]+\.[\w-]+)\S*$/, 'URL'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const cardCreationValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]+\.[\w-]+)\S*$/, 'URL'),
  }),
});
