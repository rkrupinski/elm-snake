import { GAME_OVER } from '../constants';
import { boop } from '../sounds';

const gameOver = () => (dispatch) => {
  boop();

  dispatch({
    type: GAME_OVER,
  });
};

export default gameOver;
