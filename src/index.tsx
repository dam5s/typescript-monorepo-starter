import './app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Joke} from './components/Joke';
import {Provider} from 'react-redux';
import {stateStore} from './stateStore';

ReactDOM.render(
    <Provider store={stateStore}>
        <Joke/>
    </Provider>,
    document.getElementById('root')
);
