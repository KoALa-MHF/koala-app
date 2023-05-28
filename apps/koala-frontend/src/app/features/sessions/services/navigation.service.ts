import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private sessionSidePanelVisible = false;
  private sessionAnalysisNavEnabled = false;

  private sessionSettingsSidePanelSubject = new Subject<boolean>();
  public sessionSettingsSidePanelToggled$ = this.sessionSettingsSidePanelSubject.asObservable();

  private sessionAnalysisNavSubject = new Subject<boolean>();
  public sessionAnalysisNavEnabledToggled$ = this.sessionAnalysisNavSubject.asObservable();

  public setSessionSettingsSidePanelVisible(visible: boolean) {
    this.sessionSidePanelVisible = visible;
    this.sessionSettingsSidePanelSubject.next(this.sessionSidePanelVisible);
  }

  public setAnalysisNavEnabled(enabled: boolean) {
    this.sessionAnalysisNavEnabled = enabled;
    this.sessionAnalysisNavSubject.next(this.sessionAnalysisNavEnabled);
  }
}
