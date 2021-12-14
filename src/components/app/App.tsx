import './app.css';
import {ReactElement} from 'react';
import {Provider} from 'react-redux';
import {stateStore} from '../../stateStore';
import {Joke} from '../joke/Joke';

export const App = (): ReactElement =>
    <Provider store={stateStore.create()}>
        <Joke/>
    </Provider>;
