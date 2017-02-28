import { SCORE } from '../constants';

export default function scoreReducer(state = 0, action) {
  const { type } = action;

  switch (type) {
    case SCORE:
      return state; // TODO
    default:
      return state;
  }
}
