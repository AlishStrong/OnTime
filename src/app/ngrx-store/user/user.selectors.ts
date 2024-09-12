import { UserState } from './user.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectUserState = createFeatureSelector<UserState>('user');
export const selectUsername = createSelector(selectUserState, state => state.displayName);
export const selectUID = createSelector(selectUserState, state => state.uid);
export const selectLoginError = createSelector(selectUserState, state => state.loginError);
