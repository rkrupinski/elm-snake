import { NEW_GAME, GAME_OVER } from '../constants';

export default function playingReducer(state = false, action) {
  const { type } = action;

  switch (type) {
    case NEW_GAME:
      return true;
    case GAME_OVER:
      return false;
    default:
      return state;
  }
}
