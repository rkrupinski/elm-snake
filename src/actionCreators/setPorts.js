import { SET_PORTS } from '../constants';

const setPorts = (ports) => ({
  type: SET_PORTS,
  payload: {
    ports,
  },
});

export default setPorts;
