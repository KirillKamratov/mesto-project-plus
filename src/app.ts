import path from 'path';
import express, { Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { IUser } from './utils/types';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req: IUser, res: Response, next) => {
  req.user = {
    _id: '64443005a8446d258e0c9645',
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(PORT);
});
