import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.css']
})
export class CompaniesPageComponent {
  addCompany$ = new BehaviorSubject<boolean>(false);
  addCompany() {
    this.addCompany$.next(false);
    console.log('');
  }
}
