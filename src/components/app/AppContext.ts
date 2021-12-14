import {createContext, useContext} from 'react';
import {env} from './Env';

export interface AppEnv {
    baseApiUrl: string
}

const defaultEnv: AppEnv = {
    baseApiUrl: env.require('baseApiUrl'),
};

export const AppContext =
    createContext(defaultEnv);

const use = (): AppEnv =>
    useContext(AppContext);

export const appContext = {
    defaultEnv,
    use,
};
