import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { LANGUAGE_CODE } from './core/components/header/header.component';

@Component({
  selector: 'koala-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
  ],
})
export class AppComponent implements OnInit {
  showUserProfileDialog = false;

  constructor(private primengConfig: PrimeNGConfig, private readonly translateService: TranslateService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang(LANGUAGE_CODE.GERMAN);
    this.translateService.use(LANGUAGE_CODE.GERMAN); // TODO: use browser language
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

  onUserProfileEditRequest() {
    this.showUserProfileDialog = true;
  }
}
