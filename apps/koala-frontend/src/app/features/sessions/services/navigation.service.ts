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

  public setSessionSettingsSidePanelVisible(visible: boolean) {
    this.sessionSidePanelVisible = visible;
    this.sessionSettingsSidePanelSubject.next(this.sessionSidePanelVisible);
  }
}
