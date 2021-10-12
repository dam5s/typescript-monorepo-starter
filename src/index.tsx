import './app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Joke} from './components/joke/Joke';
import {Provider} from 'react-redux';
import {stateStore} from './stateStore';

ReactDOM.render(
    <Provider store={stateStore.create()}>
        <Joke/>
    </Provider>,
    document.getElementById('root')
);
