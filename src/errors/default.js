import { ERROR_DEFAULT } from '../utils/constants';

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DEFAULT;
  }
}

export default DefaultError;
