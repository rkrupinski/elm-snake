import { take, call, select, fork, cancel } from 'redux-saga/effects';

import { SET_PORTS, NEW_GAME, GAME_OVER } from '../constants';
import playing from './playing';

export default function* gameSaga() {
  yield take(SET_PORTS);

  while (true) {
    const { control } = yield select(({ ports }) => ports);

    yield take(NEW_GAME);

    yield call([control, control.send], NEW_GAME);

    const playingTask = yield fork(playing);

    yield take(GAME_OVER);

    yield cancel(playingTask);
  }
}
