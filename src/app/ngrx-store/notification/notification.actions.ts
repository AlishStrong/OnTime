import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Notification } from './notification.reducer';

export const NotificationActions = createActionGroup({
  source: 'Notification',
  events: {
    'Set notification': props<Notification>(),
    'Clear notification': emptyProps()
  }
});
