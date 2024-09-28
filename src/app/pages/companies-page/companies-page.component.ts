import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { selectUID } from 'src/app/ngrx-store/user/user.selectors';
import { collection, doc, Firestore, setDoc, query, where, or, getDocs, and } from '@angular/fire/firestore';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.css']
})
export class CompaniesPageComponent {
  private companiesColRef;

  notify$ = new BehaviorSubject<{ type: 'success' | 'error'; message: string } | null>(null);
  addCompany$ = new BehaviorSubject<boolean>(true);
  addCompanyForm: FormGroup;

  countries: string[];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private firestore: Firestore
  ) {
    this.companiesColRef = collection(this.firestore, 'companies');

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
      (this.addCompanyForm.get(controlName)?.touched && this.addCompanyForm.get(controlName)?.invalid) ||
      (this.addCompanyForm.get(controlName)?.dirty && this.addCompanyForm.get(controlName)?.invalid);
    if (error) {
      return isInvalid && this.addCompanyForm.get(controlName)?.hasError(error);
    } else {
      return isInvalid;
    }
  }

  openAddCompanyForm() {
    this.addCompany$.next(false);
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

    this.isCompanyNew(newCompany.country, newCompany.legalName, newCompany.businessId)
      .then(_ => {
        const companyDocPath = `${v.legalName.trim().replaceAll(' ', '_').toLowerCase()}_${v.businessId.trim()}`;
        return setDoc(doc(this.companiesColRef, companyDocPath), newCompany);
      })
      .then(() => {
        this.notify$.next({
          type: 'success',
          message: `Company ${v.legalName} has been added! It will be verified soon by OnTime team!`
        });
        setTimeout(() => this.closeNotification('success'), 5000);
      })
      .catch(error => {
        if (error.message.includes('has already been registered in OnTime system!')) {
          this.notify$.next({
            type: 'error',
            message: error.message
          });
        } else {
          this.notify$.next({
            type: 'error',
            message: 'System issue has occured during registration of your company. Please try again later!'
          });
        }
      });
  }

  private isCompanyNew(country: string, legalName: string, businessId: string): Promise<boolean> {
    let message = '';

    const q = query(
      this.companiesColRef,
      and(
        where('country', '==', country),
        or(where('legalName', '==', legalName), where('businessId', '==', businessId))
      )
    );

    return getDocs(q).then(querySnapshot => {
      if (querySnapshot.empty) {
        return true;
      } else {
        querySnapshot.forEach(qds => {
          if (qds.get('legalName') === legalName) {
            this.addCompanyForm.get('legalName')?.setErrors({ alreadyExists: true });
          }
          if (qds.get('businessId') === businessId) {
            this.addCompanyForm.get('businessId')?.setErrors({ alreadyExists: true });
          }
        });
        message = `Company ${legalName} with Business ID: ${businessId} in ${country} has already been registered in OnTime system!`;
        throw new Error(message);
      }
    });
  }

  cancel() {
    this.addCompanyForm.reset();
    this.addCompany$.next(true);
  }

  closeNotification(type?: 'success' | 'error') {
    this.notify$.next(null);
    if (type === 'success') {
      this.addCompanyForm.reset();
      this.addCompany$.next(true);
    }
  }
}
