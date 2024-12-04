import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { and, collection, collectionData, Firestore, getDocs, or, query, where } from '@angular/fire/firestore';
import { catchError, map } from 'rxjs';
import { Company } from 'src/app/models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesColRef;
  private userUID;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.companiesColRef = collection(this.firestore, 'companies');
    this.userUID = this.auth.currentUser?.uid;
  }

  getUserCompanies = () => {
    const q = query(this.companiesColRef, where('ownerUID', '==', this.userUID));
    return collectionData(q).pipe(
      map(dd => {
        console.log('CompanyService getUserCompanies() collection data', dd);
        return dd as Company[];
      }),
      catchError(error => {
        console.log(`CompanyService, getUserCompanies(): Error retreiving companies for user ${this.userUID}`, error);
        return [] as Company[][];
      })
    );
  };

  private isCompanyNew = (country: string, legalName: string, businessId: string): Promise<boolean> => {
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
        message = `Company ${this.addCompanyForm.get('legalName')?.hasError('alreadyExists') ? legalName : ''}${
          this.addCompanyForm.get('businessId')?.hasError('alreadyExists') ? ' with Business ID: ' + businessId : ''
        } in ${country} has already been registered in OnTime system!`;
        throw new Error(message);
      }
    });
  };
}
