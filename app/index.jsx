import React from 'react';
import ReactDOM from 'react-dom';

import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';

import App from './components/app.jsx';

// import './main.css';

persist(alt, storage, 'app');
ReactDOM.render(<App />, document.getElementById('app'));
