import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Login with Username and Password': props<{ username: string; password: string }>(),
    'Login Error': props<{ loginError: string }>(),
    Logout: emptyProps(),
    'Set user data': props<{ displayName: string; email: string; uid: string }>(),
    'Clear login error': emptyProps()
  }
});
