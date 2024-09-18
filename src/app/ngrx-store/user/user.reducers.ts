import { FirebaseError } from '@angular/fire/app';
import { UserInfo } from '@angular/fire/auth';
import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';

export interface UserState extends Pick<UserInfo, 'displayName' | 'email' | 'uid'> {
  emailVerified: boolean;
  roles: string[];
  authError: FirebaseError['code'];
}

const initialUserState: UserState = {
  displayName: null,
  email: null,
  uid: '',
  emailVerified: false,
  roles: [],
  authError: ''
};

export const UserReducer = createReducer(
  initialUserState,
  on(
    UserActions.loginWithUsernameAndPassword,
    (state, _): UserState => ({
      ...state,
      authError: ''
    })
  ),
  on(
    UserActions.authError,
    (state, { authError }): UserState => ({
      ...state,
      displayName: null,
      email: null,
      uid: '',
      emailVerified: false,
      roles: [],
      authError
    })
  ),
  on(
    UserActions.logout,
    (_state): UserState => ({
      displayName: null,
      email: null,
      uid: '',
      emailVerified: false,
      roles: [],
      authError: ''
    })
  ),
  on(
    UserActions.setUserData,
    (state, { displayName, email, uid, emailVerified, roles }): UserState => ({
      ...state,
      displayName,
      email,
      uid,
      emailVerified,
      roles,
      authError: ''
    })
  ),
  on(
    UserActions.clearAuthError,
    (state): UserState => ({
      ...state,
      authError: ''
    })
  )
);
