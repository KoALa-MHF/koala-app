import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { LANGUAGE_CODE } from './core/components/header/header.component';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'koala-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
  ],
})
export class AppComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private primengConfig: PrimeNGConfig,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  onLanguageChange(newLanguage: LANGUAGE_CODE) {
    this.translateService.use(newLanguage).subscribe({
      next: () => {
        console.log('Language Switch Success');
      },
      error: () => {
        console.error('Language Switch Error');
      },
    });
  }
}
