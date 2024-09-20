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

  stringRequired(control: AbstractControl): ValidationErrors | null {
    const requiredError = Validators.required(control);
    if (requiredError) {
      return { stringRequired: true };
    } else {
      return control.value.trim() ? null : { stringRequired: true };
    }
  }

  passwordMinLength(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.trim().length >= length ? null : { passwordMinLength: true };
    };
  }

  passwordStartsEndsWithWhiteSpace(control: AbstractControl): ValidationErrors | null {
    return control.value.length > control.value.trim().length ? { passwordStartsEndsWithWhiteSpace: true } : null;
  }

  passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
    const regex = /\d/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsNumber: true } : null;
  }

  passwordContainsLowercase(control: AbstractControl): ValidationErrors | null {
    const regex = /[a-z]/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsLowercase: true } : null;
  }

  passwordContainsUppercase(control: AbstractControl): ValidationErrors | null {
    const regex = /[A-Z]/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsUppercase: true } : null;
  }

  passwordContainsSpecialCharacter(control: AbstractControl): ValidationErrors | null {
    const regex = /[@#$%^&+=!]/;
    const isValid = regex.test(control.value);
    return !isValid ? { containsSpecialCharacter: true } : null;
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

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.signupForm = this.fb.group(
      {
        firstname: ['', [this.stringRequired]],
        lastname: ['', [this.stringRequired]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            this.stringRequired,
            this.passwordMinLength(8),
            this.passwordStartsEndsWithWhiteSpace,
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

  invalidControl(controlName: string, error?: string) {
    const isInvalid =
      this.signupForm.get(controlName)?.touched ||
      (this.signupForm.get(controlName)?.dirty && this.signupForm.get(controlName)?.invalid);
    if (error) {
      if (error === 'any') {
        return isInvalid && this.signupForm.get(controlName)?.errors;
      }
      return isInvalid && this.signupForm.get(controlName)?.hasError(error);
    } else {
      return isInvalid;
    }
  }

  ngOnDestroy(): void {
    this.passwordStatusSubscription.unsubscribe();
  }

  signup(): void {
    const { firstname, lastname, email, password } = this.signupForm.value;
    this.store.dispatch(
      UserActions.signUp({ firstname: firstname.trim(), lastname: lastname.trim(), email, password })
    );
  }

  closeAuthErrorNotification() {
    this.store.dispatch(UserActions.clearAuthError());
  }

  cancel() {
    this.signupForm.reset();
    this.store.dispatch(UserActions.logout());
  }
}
