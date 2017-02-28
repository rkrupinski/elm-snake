import React from 'react';
import { render } from 'react-dom';

import Root from 'components/root';

try {
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('service-worker.js');
  }
} catch (err) {}

render(
  <Root />,
  document.querySelector('#app')
);
