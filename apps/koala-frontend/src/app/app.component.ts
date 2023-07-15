import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { LANGUAGE_CODE } from './core/components/header/header.component';

const DEFAULT_LANGUAGE = LANGUAGE_CODE.GERMAN;
const LANGUAGE_LOCAL_STORAGE_KEY = 'language';

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
    this.initTranslateService();
  }

  private initTranslateService() {
    this.translateService.setDefaultLang(DEFAULT_LANGUAGE);
    const userLanguage = this.getUserLanguageSelection() || this.getBrowserLanguage();
    this.translateService.use(userLanguage);
  }

  onLanguageChange(newLanguage: LANGUAGE_CODE) {
    this.translateService.use(newLanguage).subscribe({
      next: () => {
        this.setUserLanguageSelection(newLanguage);
      },
      error: () => {
        console.error('Language Switch Error');
      },
    });
  }

  private getUserLanguageSelection() {
    return localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY);
  }

  private setUserLanguageSelection(language: string) {
    return localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, language);
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
