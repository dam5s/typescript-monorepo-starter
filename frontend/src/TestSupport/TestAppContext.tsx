import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {appContext, AppContext, AppState, stateStore} from '../AppState';
import {MockWebServer} from './MockWebServer';

type TestAppContextProps = {
    readonly store?: Redux.Store<AppState>,
    readonly server?: MockWebServer,
    readonly children: React.ReactNode
};

export const TestAppContext = ({store, server, children}: TestAppContextProps): React.ReactElement => {
    const appEnv = server
        ? {...appContext.defaultEnv, baseApiUrl: server.baseUrl()}
        : appContext.defaultEnv;

    return <AppContext.Provider value={appEnv}>
        <ReactRedux.Provider store={store || stateStore.create()}>
            {children}
        </ReactRedux.Provider>
    </AppContext.Provider>;
};
