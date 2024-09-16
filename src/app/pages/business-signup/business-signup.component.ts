/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserActions } from 'src/app/ngrx-store/user/user.actions';
import { selectAuthError } from 'src/app/ngrx-store/user/user.selectors';

@Component({
  selector: 'app-business-signup',
  templateUrl: './business-signup.component.html',
  styleUrls: ['./business-signup.component.css']
})
export class BusinessSignupComponent implements OnDestroy {
  signupError$ = this.store.select(selectAuthError);

  signupForm: FormGroup;
  passwordStatusSubscription: Subscription;

  passwordContainsNumber(control: AbstractControl): { [key: string]: { value: string } } | null {
    const regex = /\d/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsNumber: { value: control.value } } : null;
  }

  passwordContainsLowercase(control: AbstractControl): { [key: string]: { value: string } } | null {
    const regex = /[a-z]/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsLowercase: { value: control.value } } : null;
  }

  passwordContainsUppercase(control: AbstractControl): { [key: string]: { value: string } } | null {
    const regex = /[A-Z]/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsUppercase: { value: control.value } } : null;
  }

  passwordContainsSpecialCharacter(control: AbstractControl): { [key: string]: { value: string } } | null {
    const regex = /[@#$%^&+=!]/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsSpecialCharacter: { value: control.value } } : null;
  }

  passwordMatchValidator(): ValidatorFn {
    return (fg: AbstractControl): ValidationErrors | null => {
      const passwordControl = fg.get('password')!;
      const confirmPasswordControl = fg.get('confirmpassword')!;

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
      return null;
    };
  }

  get firstnameInvalid() {
    return (
      this.signupForm.get('firstname')?.touched ||
      (this.signupForm.get('firstname')?.dirty && this.signupForm.get('firstname')?.invalid)
    );
  }

  get lastnameInvalid() {
    return (
      this.signupForm.get('lastname')?.touched ||
      (this.signupForm.get('lastname')?.dirty && this.signupForm.get('lastname')?.invalid)
    );
  }

  get emailInvalid() {
    return (
      this.signupForm.get('email')?.touched ||
      (this.signupForm.get('email')?.dirty && this.signupForm.get('email')?.invalid)
    );
  }

  get passwordInvalid() {
    return (
      this.signupForm.get('password')?.touched ||
      (this.signupForm.get('password')?.dirty && this.signupForm.get('password')?.invalid)
    );
  }

  get confirmPasswordInvalid() {
    return (
      this.signupForm.get('confirmpassword')?.touched ||
      (this.signupForm.get('confirmpassword')?.dirty && !this.signupForm.get('confirmpassword')?.valid)
    );
  }

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.signupForm = this.fb.group(
      {
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordContainsNumber,
            this.passwordContainsLowercase,
            this.passwordContainsUppercase,
            this.passwordContainsSpecialCharacter
          ]
        ],
        confirmpassword: [{ value: '', disabled: true }, [Validators.required]]
      },
      {
        validators: this.passwordMatchValidator()
      }
    );

    this.passwordStatusSubscription = this.signupForm.get('password')!.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.signupForm.get('confirmpassword')?.enable();
      }
      if (status === 'INVALID') {
        this.signupForm.get('confirmpassword')?.disable();
      }
    });
  }

  ngOnDestroy(): void {
    this.passwordStatusSubscription.unsubscribe();
  }

  signup(): void {
    const { firstname, lastname, email, password } = this.signupForm.value;
    this.store.dispatch(UserActions.signUp({ firstname, lastname, email, password }));
  }

  closeAuthErrorNotification() {
    this.store.dispatch(UserActions.clearAuthError());
  }

  cancel() {
    this.store.dispatch(UserActions.logout());
  }
}
