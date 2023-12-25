import {ReactElement} from 'react';
import {appContext, AppContext, stateStore} from '../AppState';
import {Provider} from 'react-redux';
import {Joke} from './Joke';
import './App.css';

export const App = (): ReactElement =>
    <AppContext.Provider value={appContext.defaultEnv}>
        <Provider store={stateStore.create()}>
            <Joke/>
        </Provider>
    </AppContext.Provider>;
