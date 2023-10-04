import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private sessionSidePanelVisible = false;
  private sessionAnalysisSidePanelVisible = false;

  private sessionSettingsSidePanelSubject = new Subject<boolean>();
  public sessionSettingsSidePanelToggled$ = this.sessionSettingsSidePanelSubject.asObservable();

  private sessionAnalysisSettingsSidePanelSubject = new Subject<boolean>();
  public sessionAnalysisSettingsSidePanelToggled$ = this.sessionAnalysisSettingsSidePanelSubject.asObservable();

  public setSessionSettingsSidePanelVisible(visible: boolean) {
    this.sessionSidePanelVisible = visible;
    this.sessionSettingsSidePanelSubject.next(this.sessionSidePanelVisible);
  }

  public setSessionAnalysisSettingsSidePanelVisible(visible: boolean) {
    this.sessionAnalysisSidePanelVisible = visible;
    this.sessionAnalysisSettingsSidePanelSubject.next(this.sessionAnalysisSidePanelVisible);
  }
}
