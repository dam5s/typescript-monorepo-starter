import * as ReduxToolkit from '@reduxjs/toolkit';
import {Result} from '../Prelude';
import {Http} from './Http';

export type HttpResultAction<T> = ReduxToolkit.PayloadAction<Result<T, Http.Error>>
