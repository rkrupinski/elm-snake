import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import branch from 'recompose/branch';
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
    null,
    {
      newGame,
    }
  ),
  setPropTypes({
    playing: PropTypes.bool.isRequired,
    newGame: PropTypes.func.isRequired,
  })
)(NewGameBtn);
