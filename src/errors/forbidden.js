import { FORBIDDEN_ERROR } from '../utils/constants';

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
