import { take, call, cancelled } from 'redux-saga/effects';

import { SCORE } from '../constants';
import { beep, boop } from '../sounds';

export default function* playing() {
  try {
    while (true) {
      yield take(SCORE);

      yield call(beep);
    }
  } finally {
    if (yield cancelled()) {
      yield call(boop);
    }
  }
}
