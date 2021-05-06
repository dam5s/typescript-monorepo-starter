import React from 'react';
import ReactDOM from 'react-dom';

import {Joke} from './components/joke';

import './app.scss';

ReactDOM.render(
    <Joke text="Chuck Norris once won a game of connect four in 3 moves."/>,
    document.getElementById('root')
);
