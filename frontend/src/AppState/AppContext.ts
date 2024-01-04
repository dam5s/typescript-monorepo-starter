import * as React from 'react';
import {env} from './Env';

const defaultEnv = {
    baseApiUrl: env.require('baseApiUrl'),
};

export const AppContext =
    React.createContext(defaultEnv);

const get = () => React.useContext(AppContext);

export const appContext = {
    defaultEnv,
    get,
};
