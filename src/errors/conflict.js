import { CONFLICT_ERROR } from '../utils/constants';

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

export default ConflictError;
