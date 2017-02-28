import gameSaga from './game';

export default function* rootSaga() {
  yield [
    gameSaga(),
  ];
}
