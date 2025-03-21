import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isAuthenticated = localStorage.getItem('userData') ? true : false;

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/blog']);
    }
  }

  loginForm: FormGroup;
  showPassword = true; // State for toggling password visibility
  error = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    ``;
    this.loginForm = this.fb.group({
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
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        // console.log('Login Successful', response);
        this.router.navigate(['/blog']);
      },
      error: (error: any) => {
        // console.error('Login Failed 😥️, please try again !');
        // console.log(`I am in error`, error);

        this.error = error;
        // alert(error.message);
        this.loginForm.markAllAsTouched();
      },
    });
  }
}
