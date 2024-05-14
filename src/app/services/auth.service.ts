import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUserSignUp, IUserLogin, IToken, IUser } from '../types/user.interface';
import { API_URL } from '../constants/constants';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { handleErrorService } from './error.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthSignal = signal<boolean>(false)

  constructor(
    private errorService: handleErrorService,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    if (typeof localStorage !== 'undefined') {
      const access_token = localStorage.getItem('access_token')
      this.isAuthSignal.set(!!access_token)
    }
  }

  signUp(userData: IUserSignUp) {
    return this.http.post(`${API_URL}/users/register`, userData)
      .pipe(
        // tap(() => {
        //   this.router.navigate(['/login'])
        // }),
        catchError(err => {
          this.errorService.handleError(err)
          throw new Error(err.message)
        })
      )
      .subscribe(
        () => {
          this.toastr.success('Signed up successfully')
          this.router.navigate(['/login'])
        }
      )
  }


  login(userData: IUserLogin) {

    // let params = new HttpParams();
    // for (const key in userData) {
    //   if (userData.hasOwnProperty(key)) {
    //     params = params.append(key, userData[key as keyof IUserLogin]);
    //   }
    // }
    const params = new HttpParams({ fromObject: userData });


    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<IToken>(`${API_URL}/auth/jwt/login`, params.toString(), { headers })
      .pipe(
        tap((res: IToken) => {
          localStorage.setItem('access_token', res.access_token)
          localStorage.setItem('refresh_token', res.refresh_token)
          this.isAuthSignal.set(true)
        }),
        catchError(err => {
          this.errorService.handleError(err)
          throw new Error(err.message)
        })
      )
      .subscribe(
        () => {
          this.toastr.success('Logged in successfully')
          this.router.navigate(['/'])
        }
      )
  }

  isAdmin(): Observable<boolean> {
    return this.hasRole('admin');
  }

  hasRole(role: string): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user.roles && user.roles.includes(role))
    );
  }

  getCurrentUser(): Observable<IUser> {
    const token = this.getAccessToken();
    if (token) {
      const params = { token };
      return this.http.get<IUser>(`${API_URL}/auth/jwt/me`, { params });
    } else {
      // Handle the case when token is not available
      // For example, you can return an observable with an error or handle it in another way
      return throwError(() => 'Token is not available');
    }
  }

  /**
   * Checks if the token is expired based on its expiration time compared to the current time.
   *
   * @param {string} token - The token to check for expiration.
   * @return {boolean} True if the token is expired, false otherwise.
   */
  isTokenExpired(token: string): boolean {
    if (!token) return true;
    const tokenExpiration = this.getTokenExpiration(token);
    return tokenExpiration <= Date.now();
  }


  /**
   * Retrieves the access token from local storage.
   *
   * @return {string | null} The access token value or null if not found.
   */
  getAccessToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('access_token');
    } else {
      return null;
    }
  }

  /**
   * Performs a refresh token operation by sending a POST request to the specified API endpoint.
   *
   * @return {Observable<any>} The observable that resolves with the updated token information.
   */
  refreshToken(): Observable<any> {

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }
    return this.http.post<IToken>(`${API_URL}/auth/jwt/refresh`, { refreshToken });
  }

  getTokenExpiration(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded.hasOwnProperty('exp')) return -1;

    const exp = decoded['exp'] * 1000;
    return exp;
  }

  /**
   * Decodes a token by splitting it into parts, decoding the middle part, and parsing it into JSON.
   *
   * @param {string} token - The token to decode.
   * @return {any} The decoded token in JSON format.
   */
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  }

}
