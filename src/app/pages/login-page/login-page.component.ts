import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: false
  });

  get emailInvalid() {
    return (
      this.loginForm.get('email')?.touched ||
      (this.loginForm.get('email')?.dirty && this.loginForm.get('email')?.invalid)
    );
  }

  get passwordInvalid() {
    return (
      this.loginForm.get('password')?.touched ||
      (this.loginForm.get('password')?.dirty && this.loginForm.get('password')?.invalid)
    );
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

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
