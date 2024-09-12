import { FirebaseError } from '@angular/fire/app';
import { UserInfo } from '@angular/fire/auth';
import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';

export interface UserState extends Pick<UserInfo, 'displayName' | 'email' | 'uid'> {
  loginError: FirebaseError['code'];
}

const initialUserState: UserState = {
  displayName: null,
  email: null,
  uid: '',
  loginError: ''
};

export const UserReducer = createReducer(
  initialUserState,
  on(
    UserActions.loginWithUsernameAndPassword,
    (state, _): UserState => ({
      ...state,
      loginError: ''
    })
  ),
  on(
    UserActions.loginError,
    (state, { loginError }): UserState => ({
      ...state,
      displayName: null,
      email: null,
      uid: '',
      loginError
    })
  ),
  on(
    UserActions.logout,
    (_state): UserState => ({
      displayName: null,
      email: null,
      uid: '',
      loginError: ''
    })
  ),
  on(
    UserActions.setUserData,
    (state, { displayName, email, uid }): UserState => ({
      ...state,
      displayName,
      email,
      uid,
      loginError: ''
    })
  ),
  on(
    UserActions.clearLoginError,
    (state): UserState => ({
      ...state,
      loginError: ''
    })
  )
);
