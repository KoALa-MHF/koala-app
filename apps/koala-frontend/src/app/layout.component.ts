import { Component } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'koala-layout',
  templateUrl: './layout.component.html',
  styleUrls: [
    './layout.component.scss',
  ],
})
export class LayoutComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private readonly authService: AuthService) {}
}
