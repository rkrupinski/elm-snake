import { NEW_GAME } from '../constants';

const newGame = (ports) => (dispatch) => {
  ports.control.send(NEW_GAME);

  dispatch({
    type: NEW_GAME,
  });
};

export default newGame;
