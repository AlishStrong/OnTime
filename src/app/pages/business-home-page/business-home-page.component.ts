import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUsername } from 'src/app/ngrx-store/user/user.selectors';

@Component({
  selector: 'app-business-home-page',
  templateUrl: './business-home-page.component.html',
  styleUrls: ['./business-home-page.component.css']
})
export class BusinessHomePageComponent {
  username$ = this.store.select(selectUsername);

  constructor(private store: Store) {}
}
