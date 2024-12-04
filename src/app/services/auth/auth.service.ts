import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  createUserWithEmailAndPassword = (email: string, password: string): Observable<UserCredential> => {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  };

  updateUser = (user: User, profileData: { displayName?: string; photoURL?: string }): Observable<User> => {
    const authPromise = updateProfile(user, profileData).then(() => user);
    return from(authPromise);
  };

  sendEmailVerification = (user: User): Observable<User> => {
    const authPromise = sendEmailVerification(user).then(() => user);
    return from(authPromise);
  };

  loginWithUsernameAndPassword = (
    username: string,
    password: string
  ): Observable<{ displayName: string; email: string; uid: string; emailVerified: boolean; roles: string[] }> => {
    const authPromise = signInWithEmailAndPassword(this.auth, username, password).then(async (uc: UserCredential) => ({
      displayName: uc.user.displayName || '',
      email: uc.user.email || '',
      uid: uc.user.uid || '',
      emailVerified: uc.user.emailVerified,
      roles: ((await uc.user.getIdTokenResult()).claims['roles'] || []) as string[]
    }));
    return from(authPromise);
  };

  logout = () => from(signOut(this.auth));
}
