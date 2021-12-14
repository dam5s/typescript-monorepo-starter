import './App.css';
import {ReactElement} from 'react';
import {Provider} from 'react-redux';
import {stateStore} from '../../stateStore';
import {Joke} from '../joke/Joke';
import {appContext, AppContext} from './AppContext';

export const App = (): ReactElement =>
    <AppContext.Provider value={appContext.defaultEnv}>
        <Provider store={stateStore.create()}>
            <Joke/>
        </Provider>
    </AppContext.Provider>;
