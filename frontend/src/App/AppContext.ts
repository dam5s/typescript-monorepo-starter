import {createContext, useContext} from 'react';
import {env} from './Env';

const defaultEnv = {
    baseApiUrl: env.require('baseApiUrl'),
};

export const AppContext =
    createContext(defaultEnv);

const get = () => useContext(AppContext);

export const appContext = {
    defaultEnv,
    get,
};
