import React from 'react';
import ReactDOM from 'react-dom/client';
// Redux
// import {Provider} from 'react-redux';
// import store from './redux/store';
// Router
import {BrowserRouter} from 'react-router-dom';
// Components
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);