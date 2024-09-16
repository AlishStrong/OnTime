import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Login with Username and Password': props<{ username: string; password: string }>(),
    'Auth Error': props<{ authError: string }>(),
    Logout: emptyProps(),
    'Set user data': props<{ displayName: string; email: string; uid: string }>(),
    'Clear auth error': emptyProps(),
    'Sign up': props<{ firstname: string; lastname: string; email: string; password: string }>()
  }
});
