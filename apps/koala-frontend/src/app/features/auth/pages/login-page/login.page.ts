import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { credentialsValidator } from './credentials.validator';

@Component({
  selector: 'koala-login-page',
  templateUrl: './login.page.html',
  styleUrls: [
    './login.page.scss',
  ],
})
export class LoginPage implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;

  loginForm = new FormGroup(
    {
      username: new FormControl<string>(''),
      password: new FormControl<string>(''),
      sessionCode: new FormControl<string>(''),
    },
    {
      validators: [
        credentialsValidator,
      ],
    }
  );

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated === true) {
        this.router.navigate([
          'sessions',
        ]);
      }
    });
  }

  public onLogin() {
    if (this.username !== '' && this.password !== '') {
      //use username and password prefereably over session code
      this.authService.loginViaUsername('', '');
    } else if (this.sessionCode !== '') {
      this.authService.loginViaSessionCode('');
    } else {
      //should not happen because form is not validated => error
    }
  }

  get username() {
    return this.loginForm.get('username')?.value;
  }

  get password() {
    return this.loginForm.get('password')?.value;
  }

  get sessionCode() {
    return this.loginForm.get('sessionCode')?.value;
  }
}
