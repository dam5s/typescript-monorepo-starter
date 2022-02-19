import {ReactElement, ReactNode} from 'react';
import {appContext, AppContext} from '../App/AppContext';
import {Provider} from 'react-redux';
import {AppState, stateStore} from '../App/StateStore';
import {Store} from 'redux';
import {MockWebServer} from './MockWebServer';

type TestAppContextProps = {
    store?: Store<AppState>,
    server?: MockWebServer,
    children: ReactNode
};

export const TestAppContext = ({store, server, children}: TestAppContextProps): ReactElement => {
    const appEnv = server
        ? {...appContext.defaultEnv, baseApiUrl: server.baseUrl()}
        : appContext.defaultEnv;

    return <AppContext.Provider value={appEnv}>
        <Provider store={store || stateStore.create()}>
            {children}
        </Provider>
    </AppContext.Provider>;
};
