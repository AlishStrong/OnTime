import { createFeatureSelector } from '@ngrx/store';
import { NotificationState } from './notification.reducer';

export const selectNotification = createFeatureSelector<NotificationState>('notification');
