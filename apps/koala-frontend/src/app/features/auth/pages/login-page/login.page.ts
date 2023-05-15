import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'koala-login-page',
  templateUrl: './login.page.html',
  styleUrls: [
    './login.page.scss',
  ],
})
export class LoginPage implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;

  loginForm = new FormGroup({
    sessionCode: new FormControl<string>('', [
      Validators.required,
    ]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated === true) {
        this.router.navigate([
          'sessions',
        ]);
      }
    });

    const sessionCode = this.route.snapshot.queryParamMap.get('sessionCode');
    const jwt = this.route.snapshot.queryParamMap.get('jwt');

    if (jwt) {
      this.authService.loginViaSaml(jwt);
    }

    if (sessionCode) {
      this.loginForm.get('sessionCode')?.setValue(sessionCode);
    }
  }

  public onCodeLogin() {
    if (this.sessionCode) {
      this.authService.loginViaSessionCode(this.sessionCode);
    }
  }

  get sessionCode() {
    return this.loginForm.get('sessionCode')?.value;
  }
}
