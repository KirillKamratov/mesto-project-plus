import { ERROR_NOT_FOUND } from '../utils/constants';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
  }
}

export default NotFoundError;
