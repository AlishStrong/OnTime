import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectShowLogin } from './ngrx-store/view/view.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private store: Store) {}

  isLoggedIn$ = this.store.select(selectShowLogin);
}
