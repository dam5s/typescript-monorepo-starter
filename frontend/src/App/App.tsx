import * as React from 'react';
import * as ReactRedux from 'react-redux';
import {appContext, AppContext, stateStore} from '../AppState';
import {Joke} from './Joke';
import './App.css';

export const App = (): React.ReactElement =>
    <AppContext.Provider value={appContext.defaultEnv}>
        <ReactRedux.Provider store={stateStore.create()}>
            <Joke/>
        </ReactRedux.Provider>
    </AppContext.Provider>;
