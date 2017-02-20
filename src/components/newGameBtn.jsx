import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import renderNothing from 'recompose/renderNothing';
import setPropTypes from 'recompose/setPropTypes';

import { identity } from '../utils';
import newGame from '../actionCreators/newGame';

const NewGameBtn = ({ newGame }) => (
  <button onClick={newGame}>New game</button>
);

export default compose(
  branch(
    ({ playing }) => !playing,
    identity,
    renderNothing
  ),
  connect(
    ({ ports }) => ({
      ports,
    }),
    (dispatch) => ({
      dispatch,
    }),
    ({ ports }, { dispatch }, ownProps) => ({
      ...ownProps,
      newGame() {
        dispatch(newGame(ports));
      },
    })
  ),
  setPropTypes({
    newGame: PropTypes.func.isRequired,
    playing: PropTypes.bool.isRequired,
  })
)(NewGameBtn);
