import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/ngrx-store/user/user.actions';
import { selectAuthError } from 'src/app/ngrx-store/user/user.selectors';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginError$ = this.store.select(selectAuthError);

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: false
    });
  }

  invalidControl(controlName: string, error?: string) {
    const isInvalid =
      this.loginForm.get(controlName)?.touched ||
      (this.loginForm.get(controlName)?.dirty && this.loginForm.get(controlName)?.invalid);
    if (error) {
      if (error === 'any') {
        return isInvalid && this.loginForm.get(controlName)?.errors;
      }
      return isInvalid && this.loginForm.get(controlName)?.hasError(error);
    } else {
      return isInvalid;
    }
  }

  login(): void {
    const { email, password } = this.loginForm.value;
    if (email && password) {
      this.store.dispatch(UserActions.loginWithUsernameAndPassword({ username: email, password }));
    }
  }

  closeAuthErrorNotification() {
    this.store.dispatch(UserActions.clearAuthError());
  }

  cancel() {
    this.store.dispatch(UserActions.logout());
  }
}
