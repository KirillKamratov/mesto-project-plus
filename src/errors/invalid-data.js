import { ERROR_INVALID_DATA } from '../utils/constants';

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_INVALID_DATA;
  }
}

export default InvalidDataError;
