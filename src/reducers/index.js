import { combineReducers } from 'redux';

import playingReducer from './playing';
import scoreReducer from './score';
import portsReducer from './ports';

export default combineReducers({
  playing: playingReducer,
  score: scoreReducer,
  ports: portsReducer,
});
