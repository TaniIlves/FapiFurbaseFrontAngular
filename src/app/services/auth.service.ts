import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUserSignUp, IUserLogin, IToken } from '../types/user.interface';
import { API_URL } from '../constants/constants';
import { catchError, tap } from 'rxjs';
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
}
