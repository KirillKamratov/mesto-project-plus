import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import appRoutes from './routes/index';
import errorHandler from './middlewares/errors';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.use(appRoutes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(PORT);
});
