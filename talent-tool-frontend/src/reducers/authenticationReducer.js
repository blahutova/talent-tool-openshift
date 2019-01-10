import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function authenticationReducer(state = initialState.keycloakInfo, action) {
  switch(action.type) {
    case types.AUTHENTICATION_SUCCESS:
      // localStorage.setItem('token', action.keycloakInfo.token);
      // localStorage.setItem('roles', action.keycloakInfo.tokenParsed.realm_access.roles);
      return Object.assign({}, action.keycloakInfo)
    default:
      return state;
  }
}
