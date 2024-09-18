import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/ngrx-store/user/user.actions';
import { selectUID } from 'src/app/ngrx-store/user/user.selectors';
import { selectShowLogin, selectShowNavbar, selectShowSignup } from 'src/app/ngrx-store/view/view.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showNavbar$ = this.store.select(selectShowNavbar);
  showLogin$ = this.store.select(selectShowLogin);
  showSignup$ = this.store.select(selectShowSignup);
  uid$ = this.store.select(selectUID);

  constructor(private store: Store) {}

  logout = () => {
    this.store.dispatch(UserActions.logout());
  };
}
