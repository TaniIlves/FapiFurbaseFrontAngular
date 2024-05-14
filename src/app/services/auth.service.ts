import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAuthUser } from '../types/user.interface';
import { API_URL } from '../constants/constants';
import { catchError } from 'rxjs';
import { handleErrorService } from './error.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private errorService: handleErrorService,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) { }

  signUp(userData: IAuthUser) {
    return this.http.post(`${API_URL}/users/register`, userData)
      .pipe(
        catchError(err => {
          this.errorService.handleError(err)
          throw new Error(err.message)
        })
      )
      .subscribe(
        () => {
          this.toastr.success('Signed up successfully')
        }
      )
  }

}
