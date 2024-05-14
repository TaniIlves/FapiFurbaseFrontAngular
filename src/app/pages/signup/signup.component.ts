import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  userData: FormGroup


  constructor(private readonly authService: AuthService) {
    this.userData = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    this.userData.get('confirmPassword')?.setValidators(this.passwordsMatchValidator());
    this.userData.get('password')?.valueChanges.subscribe(() => {
      this.userData.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.userData.get('password')?.value;
      const confirmPassword = control.value;

      return password === confirmPassword ? null : { passwordsNotMatch: true };
    };
  }


  onSubmit() {
    if (this.userData.valid) {
      this.authService.signUp(this.userData.value)
    }

    // if (this.userData.valid) {
    //   console.log(this.userData.value)
    // } else {
    //   console.log('Form is not valid')
    // }
  }
}
