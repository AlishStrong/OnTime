import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth.service';
import { UserActions } from './user.actions';
import { map, catchError, exhaustMap, tap, switchMap } from 'rxjs/operators';
import { FirebaseError } from '@firebase/util';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  ngrxOnInitEffects = () => {
    const displayName = localStorage.getItem('displayName');
    const email = localStorage.getItem('email');
    const uid = localStorage.getItem('uid');
    if (displayName && email && uid) {
      return UserActions.setUserData({ displayName, email, uid });
    } else {
      return UserActions.logout();
    }
  };

  getUserData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loginWithUsernameAndPassword),
      exhaustMap(({ username, password }) =>
        this.authService.loginWithUsernameAndPassword(username, password).pipe(
          map(userData => UserActions.setUserData(userData)),
          catchError((error: FirebaseError) => {
            console.error(error);
            let authError = '';
            switch (error.code) {
              case 'auth/network-request-failed':
                authError = 'Auth is down, please try again later';
                break;
              default:
                authError = 'Wrong username or password';
                break;
            }
            return of(UserActions.authError({ authError }));
          })
        )
      )
    );
  });

  setUserDataToLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.setUserData),
        tap(({ displayName, email, uid }) => {
          localStorage.setItem('displayName', displayName);
          localStorage.setItem('email', email);
          localStorage.setItem('uid', uid);
          this.router.navigate(['/home']);
        })
      );
    },
    { dispatch: false }
  );

  signoutUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.logout),
        exhaustMap(() => this.authService.logout()),
        tap(() => this.router.navigate(['']))
      );
    },
    { dispatch: false }
  );

  removeUserDataFromLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.logout, UserActions.authError),
        tap(() => localStorage.clear())
      );
    },
    { dispatch: false }
  );

  createBusinessUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.signUp),
      exhaustMap(({ firstname, lastname, email, password }) => {
        const displayName = `${firstname} ${lastname}`;
        return this.authService.createUserWithEmailAndPassword(email, password).pipe(
          map(uc => uc.user),
          switchMap(user => this.authService.updateUser(user, { displayName: `${firstname} ${lastname}` })),
          map(user =>
            UserActions.setUserData({
              displayName,
              email,
              uid: user.uid
            })
          )
        );
      }),
      catchError((error: FirebaseError) => {
        console.error(error);
        let authError = '';
        switch (error.code) {
          case 'auth/network-request-failed':
            authError = 'Auth is down, please try again later';
            break;
          case 'auth/email-already-in-use':
            authError = 'User with such email already exists';
            break;
          default:
            authError = 'Wrong username or password';
            break;
        }
        return of(UserActions.authError({ authError }));
      })
    );
  });
}
