import { dispatchRequest } from '../../utils/fetchUtils';
import UserRegisterResource from '../../../../../shared/resources/user/UserRegisterResource';
import * as Reducer from './reducers';
import UserLoginResource from '../../../../../shared/resources/user/UserLoginResource';
const jwtDecode = require('jwt-decode');

export function register(registerResource: UserRegisterResource, successCallback, errorCallback) {
    return dispatch =>
        dispatchRequest('api/user/register', 'POST', JSON.parse(JSON.stringify(registerResource)), data => {
            successCallback(data);
            Reducer.register(data);
        }, err => {
            errorCallback(err);
        });
}

export function login(loginResource: UserLoginResource, successCallback, errorCallback) {
    return dispatch =>
        dispatchRequest('api/user/login', 'POST', JSON.parse(JSON.stringify(loginResource)), data => {
            localStorage.setItem('id_token', data.jwtToken);
            decodeUserDataToStoreFromLocal(dispatch);
            successCallback(data);
        }, err => {
            errorCallback(err);
        });
}

export function decodeUserDataToStoreFromLocal(dispatch) {
    const token = localStorage.getItem('id_token');
    if (token) {
        const user = jwtDecode(token);
        dispatch(Reducer.login(user));
        return user;
    }
}
