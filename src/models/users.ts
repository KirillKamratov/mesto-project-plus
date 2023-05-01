import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { AVATAR_URL_REG_EXP } from '../utils/constants';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link: string) => AVATAR_URL_REG_EXP.test(link),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user;
    });
  });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
