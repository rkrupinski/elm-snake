import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Elm from 'react-elm-components'
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import setPropTypes from 'recompose/setPropTypes';

import { Snake } from 'Snake';
import { KEY_MAP, GAME_OVER, SCORE } from '../constants';
import setPorts from '../actionCreators/setPorts';
import gameOver from '../actionCreators/gameOver';
import score from '../actionCreators/score';
import NewGameBtn from './newGameBtn';


const App = ({ playing, setupPorts }) => (
  <div>
    <Elm
      src={Snake}
      ports={setupPorts} />
    <NewGameBtn
      playing={playing} />
  </div>
);

export default compose(
  connect(
    ({ playing, ports }) => ({
      playing,
      ports,
    }),
    (dispatch) => ({
      dispatch,
    }),
    (stateProps, { dispatch }, ownProps) => ({
      ...ownProps,
      ...stateProps,
      setupPorts(ports) {
        dispatch(setPorts(ports));

        ports.gameplay.subscribe(type => {
          switch (type) {
            case GAME_OVER:
              return dispatch(gameOver());
            case SCORE:
              return dispatch(score());
          }
        });
      },
    })
  ),
  withHandlers({
    onKeyDown: ({ ports }) => ({ keyCode }) => {
      const { [keyCode]: direction } = KEY_MAP;

      direction && ports.turns.send(direction);
    },
  }),
  lifecycle({
    componentDidMount() {
      const { onKeyDown } = this.props;

      window.addEventListener('keydown', onKeyDown);
    },
    componentWillUnmount() {
      const { onKeyDown } = this.props;

      window.removeEventListener('keydown', onKeyDown);
    }
  }),
  setPropTypes({
    playing: PropTypes.bool.isRequired,
    setupPorts: PropTypes.func.isRequired,
    ports: PropTypes.object
  })
)(App);
