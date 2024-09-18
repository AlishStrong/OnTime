import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserState } from 'src/app/ngrx-store/user/user.selectors';

@Component({
  selector: 'app-business-home-page',
  templateUrl: './business-home-page.component.html',
  styleUrls: ['./business-home-page.component.css']
})
export class BusinessHomePageComponent {
  user$ = this.store.select(selectUserState);

  constructor(private store: Store) {}
}
