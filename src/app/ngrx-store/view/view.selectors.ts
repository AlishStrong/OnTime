import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { selectUID } from '../user/user.selectors';

export const selectShowLogin = createSelector(selectUID, getRouterSelectors().selectUrl, (uid, url) => {
  return !uid && url !== '/login';
});
export const selectShowSignup = createSelector(selectUID, getRouterSelectors().selectUrl, (uid, url) => {
  return !uid && url !== '/signup';
});
export const selectShowNavbar = createSelector(getRouterSelectors().selectUrl, url => {
  return url !== '/login' && url !== '/signup';
});
