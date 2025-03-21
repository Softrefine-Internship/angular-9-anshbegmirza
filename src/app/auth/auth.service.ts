import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null); // Allow null
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  apiKey: string = `AIzaSyAP_dSyBSfl3P4JUgcx9_pySZmWh3Sr854`;

  signup(email: string, password: string, firstName: string, lastName: string) {
    const signupData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    // console.log('Signup Data', signupData);

    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        signupData
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          // console.log(resData);
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );

          // storing the data in realtime database
          const userData = {
            userId: resData.localId,
            userData: {
              firstName,
              lastName,
              email,
              password,
            },
            createdAt: new Date().toISOString(),
          };

          this.http
            .put(
              `https://angular-blogs-9-default-rtdb.firebaseio.com//users/${resData.localId}.json?auth=${resData.idToken}`,
              userData
            )
            .subscribe((response) => {
              // console.log('User data saved:', response);
            });
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      firstName: string;
      lastName: string;
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.id,
      userData._token,
      userData._tokenExpirationDate
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number,
    firstName?: string,
    lastName?: string,
    password?: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      firstName || '',
      lastName || '',
      email,
      password || '',
      token,
      expirationDate.toString()
    );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.error('Firebase error', errorRes);
    let errorMessage = 'An unknown error occurred!';
    console.error(errorRes.error.error.message);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email  already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid login details';
        break;
    }
    return throwError(() => errorMessage);
  }
}
