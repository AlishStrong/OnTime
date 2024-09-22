import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { selectUID } from 'src/app/ngrx-store/user/user.selectors';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.css']
})
export class CompaniesPageComponent {
  addCompany$ = new BehaviorSubject<boolean>(false);
  addCompanyForm: FormGroup;

  countries: string[];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private firestore: Firestore
  ) {
    // TODO: fetch from DB
    this.countries = ['Uzbekistan', 'Finland'].sort();

    this.addCompanyForm = this.fb.group({
      country: ['', [Validators.required]],
      legalName: ['', [Validators.required]],
      businessId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
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
    const v = this.addCompanyForm.value;
    const newCompany: Company = {
      country: v.country,
      legalName: v.legalName,
      businessId: v.businessId,
      name: v.name,
      email: v.email,
      phone: v.phone,
      address: {
        street: v.address.street,
        city: v.address.city,
        postalNumber: v.address.postalNumber
      },
      locations: [],
      ownerUID: this.store.selectSignal(selectUID)(),
      verified: false
    };
    console.log(newCompany);

    setDoc(
      doc(collection(this.firestore, 'companies'), v.legalName.trim().replaceAll(' ', '_').toLowerCase()),
      newCompany
    )
      .then(() => console.log('company document was created'))
      .catch(error => console.log('firestore error', error));
    this.addCompany$.next(false);
  }

  cancel() {
    this.addCompanyForm.reset();
    this.addCompany$.next(true);
  }
}
