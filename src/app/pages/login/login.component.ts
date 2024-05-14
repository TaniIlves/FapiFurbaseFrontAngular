import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userData: FormGroup


  constructor(private readonly authService: AuthService) {
    this.userData = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    })
  }


onSubmit() {
  if (this.userData.valid) {
    this.authService.login(this.userData.value)
  } else {
    console.log('Form is not valid')
  }
}
}
