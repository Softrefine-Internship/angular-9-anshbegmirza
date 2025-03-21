import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from './auth/user.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-9';
  constructor(private AuthService: AuthService) {}

  //  auto login user if data present.
  ngOnInit(): void {
    this.AuthService.autoLogin();
  }
}
