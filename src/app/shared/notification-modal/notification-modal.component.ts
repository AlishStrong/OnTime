import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationActions } from 'src/app/ngrx-store/notification/notification.actions';
import { selectNotification } from 'src/app/ngrx-store/notification/notification.selectors';
// import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent {
  notification$ = this.store.select(selectNotification);

  constructor(private store: Store) {}

  closeNotification() {
    this.store.dispatch(NotificationActions.clearNotification());
  }
}
