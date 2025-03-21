import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  isSignupPage = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('userData');

    this.isSignupPage = this.router.url === '/signup';

    this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    this.authService.autoLogin();
  }

  onLogout() {
    this.authService.logout();
  }

  onClickSignup() {
    this.router.navigate(['/signup']);
  }

  onClickLogin() {
    this.router.navigate(['/login']);
  }
}
