import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  loginWithUsernameAndPassword = (
    username: string,
    password: string
  ): Observable<{ displayName: string; email: string; uid: string }> => {
    const authPromise = signInWithEmailAndPassword(this.auth, username, password)
      .then(uc => {
        uc.user.getIdTokenResult().then(t => {
          console.log('User Credentials ID token claims, i.e. ROLES', t.claims['roles']);
        });

        return uc;
      })
      .then((uc: UserCredential) => ({
        displayName: uc.user.displayName || '',
        email: uc.user.email || '',
        uid: uc.user.uid || ''
      }));
    return from(authPromise);
  };

  logout = () => from(signOut(this.auth));
}
