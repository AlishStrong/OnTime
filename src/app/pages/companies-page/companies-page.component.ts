import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.css']
})
export class CompaniesPageComponent {
  addCompany$ = new BehaviorSubject<boolean>(false);
  addCompanyForm: FormGroup;

  countries: string[];

  constructor(private fb: FormBuilder) {
    // TODO: fetch from DB
    this.countries = ['Uzbekistan', 'Finland'].sort();

    this.addCompanyForm = this.fb.group({
      country: ['', [Validators.required]],
      legalName: ['', [Validators.required]],
      businessId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      streetAddress: this.fb.group({
        streetName: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postalNumber: ['', [Validators.required]]
      })
    });
  }

  invalidControl(controlName: string, error?: string) {
    const isInvalid =
      this.addCompanyForm.get(controlName)?.touched ||
      (this.addCompanyForm.get(controlName)?.dirty && this.addCompanyForm.get(controlName)?.invalid);
    if (error) {
      if (error === 'any') {
        return isInvalid && this.addCompanyForm.get(controlName)?.errors;
      }
      return isInvalid && this.addCompanyForm.get(controlName)?.hasError(error);
    } else {
      return isInvalid;
    }
  }

  addCompany() {
    this.addCompany$.next(false);
    console.log(this.addCompanyForm.getRawValue());
  }

  cancel() {
    this.addCompanyForm.reset();
    this.addCompany$.next(true);
  }
}
