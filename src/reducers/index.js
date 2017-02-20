import { combineReducers } from 'redux';

import playingReducer from './playing';
import portsReducer from './ports';

export default combineReducers({
  playing: playingReducer,
  ports: portsReducer,
});
