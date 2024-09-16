import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectShowNavbar } from './ngrx-store/view/view.selectors';
import { selectUID } from './ngrx-store/user/user.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private store: Store) {}

  isLoggedIn$ = this.store.select(selectUID);
  whiteBackground$ = this.store.select(selectShowNavbar);
}
