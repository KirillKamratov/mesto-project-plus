import mongoose, { Date } from 'mongoose';
import { PICTURE_URL_REG_EXP } from '../utils/constants';

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: Array<string>;
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link: string) => PICTURE_URL_REG_EXP.test(link),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
