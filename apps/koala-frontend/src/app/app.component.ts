import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { LANGUAGE_CODE } from './core/components/header/header.component';

const DEFAULT_LANGUAGE = LANGUAGE_CODE.GERMAN;

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
    this.translateService.setDefaultLang(DEFAULT_LANGUAGE);
    console.log('this.getBrowserLanguage()', this.getBrowserLanguage());
    this.translateService.use(this.getBrowserLanguage());
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

  private getBrowserLanguage() {
    const browserLanguage = navigator.languages
      .map((language) => language.split('-')[0])
      .find((languageCode) => Object.values(LANGUAGE_CODE).includes(languageCode as LANGUAGE_CODE));
    return browserLanguage || DEFAULT_LANGUAGE;
  }

  onUserProfileEditRequest() {
    this.showUserProfileDialog = true;
  }
}
