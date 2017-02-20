import { SET_PORTS } from '../constants';

export default function portsReducer(state = null, action) {
  const { type, payload: { ports } = {} } = action;

  switch (type) {
    case SET_PORTS:
      return ports;
    default:
      return state;
  }
}
