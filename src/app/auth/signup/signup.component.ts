import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword = false;
  confirmPassword = false;
  error = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60),
            Validators.pattern(/^[A-Za-z]{2,60}$/),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60),
            Validators.pattern(/^[A-Za-z]{2,60}$/),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPassword = !this.confirmPassword;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // console.log(this.signupForm.value);

    const { firstName, lastName, email, password } = this.signupForm.value;
    this.authService
      .signup(email, password, firstName, lastName)
      .pipe(
        tap((response) => {
          // console.log('Signup Successful', response);
          this.router.navigate(['/login']);
        }),
        catchError((error: any) => {
          console.error('Some error occurred 😥️, please try again!');
          this.error = error;
          this.signupForm.markAllAsTouched();
          return throwError(() => error); // Rethrow error if you need to handle it elsewhere
        })
      )
      .subscribe();
  }
}
