import { createReducer, on } from '@ngrx/store';
import { NotificationActions } from './notification.actions';

export interface Notification {
  status: 'success' | 'error';
  message: string;
}

export type NotificationState = Notification | undefined;

let initialNotificationState: NotificationState;

export const NotificationReducer = createReducer(
  initialNotificationState,
  on(NotificationActions.setNotification, (_state, { status, message }): NotificationState => ({ status, message })),
  on(NotificationActions.clearNotification, (_state): NotificationState => undefined)
);
