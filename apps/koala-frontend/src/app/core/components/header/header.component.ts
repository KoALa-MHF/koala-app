import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'koala-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
  ],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  ngOnInit(): void {}

  public onToolbarSessionsPressed() {
    this.router.navigate([
      'sessions',
    ]);
  }

  public onToolbarHomePressed() {
    this.router.navigate([
      '',
    ]);
  }

  public onLogout() {
    this.authService.logout();
  }
}
